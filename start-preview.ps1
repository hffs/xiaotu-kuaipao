# Listens on every network interface so a phone on the same Wi-Fi can open the preview.
# TcpListener does not need an administrator URL reservation. HttpListener on http://+:port/ does.
$ErrorActionPreference = 'Stop'

try {
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [Console]::OutputEncoding = $utf8
  $OutputEncoding = $utf8
} catch {}

$root = (Resolve-Path (Split-Path -Parent $MyInvocation.MyCommand.Path)).Path
$port = 8647
$localUrl = "http://127.0.0.1:$port/preview/"

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.htm'  = 'text/html; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.gif'  = 'image/gif'
  '.ico'  = 'image/x-icon'
  '.svg'  = 'image/svg+xml'
  '.md'   = 'text/plain; charset=utf-8'
  '.txt'  = 'text/plain; charset=utf-8'
  '.mp3'  = 'audio/mpeg'
}

$qrJs = @'
function makeQrMatrix(text) {
  var EXP = new Array(512);
  var LOG = new Array(256);
  var x = 1;
  var i;
  for (i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
  for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  function rs(data, nsym) {
    var gen = [1];
    var i2, j2;
    for (i2 = 0; i2 < nsym; i2++) {
      var next = [];
      for (j2 = 0; j2 < gen.length + 1; j2++) next.push(0);
      for (j2 = 0; j2 < gen.length; j2++) {
        next[j2] ^= gen[j2];
        next[j2 + 1] ^= gfMul(gen[j2], EXP[i2]);
      }
      gen = next;
    }
    var res = data.slice();
    for (i2 = 0; i2 < nsym; i2++) res.push(0);
    for (i2 = 0; i2 < data.length; i2++) {
      var coef = res[i2];
      if (coef === 0) continue;
      for (j2 = 0; j2 < gen.length; j2++) res[i2 + j2] ^= gfMul(gen[j2], coef);
    }
    return res.slice(data.length);
  }

  var raw = [];
  for (i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if (code > 127) return null;
    raw.push(code);
  }
  if (raw.length > 42) return null;
  var bits = [];
  function pushBits(val, n) {
    var k;
    for (k = n - 1; k >= 0; k--) bits.push((val >>> k) & 1);
  }
  pushBits(4, 4);
  pushBits(raw.length, 8);
  for (i = 0; i < raw.length; i++) pushBits(raw[i], 8);
  var guard = 0;
  while (bits.length < 44 * 8 && guard < 4) {
    bits.push(0);
    guard++;
  }
  while (bits.length % 8 !== 0) bits.push(0);
  var bytes = [];
  for (i = 0; i + 8 <= bits.length; i += 8) {
    var b = 0;
    var j;
    for (j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    bytes.push(b);
  }
  var flip = 0xec;
  while (bytes.length < 44) {
    bytes.push(flip);
    flip = flip === 0xec ? 0x11 : 0xec;
  }
  var ecc = rs(bytes, 26);
  var cw = bytes.concat(ecc);

  var N = 29;
  var base = [];
  var isFunc = [];
  var r, c;
  for (r = 0; r < N; r++) {
    base.push([]);
    isFunc.push([]);
    for (c = 0; c < N; c++) {
      base[r].push(false);
      isFunc[r].push(false);
    }
  }
  function setFn(col, row, dark) {
    if (col < 0 || row < 0 || col >= N || row >= N) return;
    base[row][col] = !!dark;
    isFunc[row][col] = true;
  }
  function finder(ox, oy) {
    var dy, dx;
    for (dy = -1; dy <= 7; dy++) {
      for (dx = -1; dx <= 7; dx++) {
        var xx = ox + dx;
        var yy = oy + dy;
        var on = false;
        if (dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6) {
          on = dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
        }
        setFn(xx, yy, on);
      }
    }
  }
  finder(0, 0);
  finder(N - 7, 0);
  finder(0, N - 7);
  for (i = 0; i < N; i++) {
    if (!isFunc[6][i]) setFn(i, 6, i % 2 === 0);
    if (!isFunc[i][6]) setFn(6, i, i % 2 === 0);
  }
  var ay, ax;
  for (ay = -2; ay <= 2; ay++) {
    for (ax = -2; ax <= 2; ax++) {
      setFn(22 + ax, 22 + ay, Math.max(Math.abs(ax), Math.abs(ay)) !== 1);
    }
  }
  setFn(8, N - 8, true);
  for (i = 0; i < 9; i++) {
    isFunc[8][i] = true;
    isFunc[i][8] = true;
  }
  for (i = 0; i < 8; i++) {
    isFunc[8][N - 1 - i] = true;
    isFunc[N - 1 - i][8] = true;
  }

  var bitIndex = 0;
  function takeBit() {
    if (bitIndex >= cw.length * 8) return 0;
    var by = cw[bitIndex >> 3];
    var bit = (by >> (7 - (bitIndex & 7))) & 1;
    bitIndex++;
    return bit;
  }
  var col = N - 1;
  var upward = true;
  while (col > 0) {
    if (col === 6) col--;
    for (i = 0; i < N; i++) {
      var row = upward ? (N - 1 - i) : i;
      var k;
      for (k = 0; k < 2; k++) {
        var xx2 = col - k;
        if (isFunc[row][xx2]) continue;
        base[row][xx2] = takeBit() === 1;
      }
    }
    upward = !upward;
    col -= 2;
  }

  function formatBits(mask) {
    var data = mask;
    var rem = data;
    var t;
    for (t = 0; t < 10; t++) rem = (rem << 1) ^ ((rem >> 9) * 0x537);
    return ((data << 10) | (rem & 0x3ff)) ^ 0x5412;
  }
  function maskBit(mask, row, col2) {
    if (mask === 0) return ((row + col2) % 2) === 0;
    if (mask === 1) return (row % 2) === 0;
    if (mask === 2) return (col2 % 3) === 0;
    if (mask === 3) return ((row + col2) % 3) === 0;
    if (mask === 4) return ((Math.floor(row / 2) + Math.floor(col2 / 3)) % 2) === 0;
    if (mask === 5) return ((row * col2) % 2 + (row * col2) % 3) === 0;
    if (mask === 6) return (((row * col2) % 2 + (row * col2) % 3) % 2) === 0;
    return (((row + col2) % 2 + (row * col2) % 3) % 2) === 0;
  }
  function applyFormat(grid, mask) {
    var bits = formatBits(mask);
    var i3;
    function put(col3, row3, bit) {
      grid[row3][col3] = bit;
    }
    for (i3 = 0; i3 < 6; i3++) put(8, i3, ((bits >> i3) & 1) === 1);
    put(8, 7, ((bits >> 6) & 1) === 1);
    put(8, 8, ((bits >> 7) & 1) === 1);
    put(7, 8, ((bits >> 8) & 1) === 1);
    for (i3 = 9; i3 < 15; i3++) put(14 - i3, 8, ((bits >> i3) & 1) === 1);
    for (i3 = 0; i3 < 8; i3++) put(N - 1 - i3, 8, ((bits >> i3) & 1) === 1);
    for (i3 = 8; i3 < 15; i3++) put(8, N - 15 + i3, ((bits >> i3) & 1) === 1);
    put(8, N - 8, true);
  }
  function score(grid) {
    var result = 0;
    var y2, x2, run, color, len;
    function runs(read) {
      var a, b;
      for (a = 0; a < N; a++) {
        color = read(a, 0);
        len = 1;
        for (b = 1; b < N; b++) {
          var v = read(a, b);
          if (v === color) {
            len++;
            if (len === 5) result += 3;
            else if (len > 5) result += 1;
          } else {
            color = v;
            len = 1;
          }
        }
      }
    }
    runs(function (a, b) { return grid[a][b]; });
    runs(function (a, b) { return grid[b][a]; });
    for (y2 = 0; y2 < N - 1; y2++) {
      for (x2 = 0; x2 < N - 1; x2++) {
        var v2 = grid[y2][x2];
        if (v2 === grid[y2][x2 + 1] && v2 === grid[y2 + 1][x2] && v2 === grid[y2 + 1][x2 + 1]) result += 3;
      }
    }
    var dark = 0;
    for (y2 = 0; y2 < N; y2++) {
      for (x2 = 0; x2 < N; x2++) if (grid[y2][x2]) dark++;
    }
    var pct = Math.abs(Math.ceil(dark * 100 / (N * N) - 50)) / 5;
    result += pct * 10;
    return result;
  }

  var best = null;
  var bestScore = 1e9;
  var mask;
  for (mask = 0; mask < 8; mask++) {
    var grid = [];
    for (r = 0; r < N; r++) {
      grid.push([]);
      for (c = 0; c < N; c++) {
        var dark = base[r][c];
        if (!isFunc[r][c] && maskBit(mask, r, c)) dark = !dark;
        grid[r].push(dark);
      }
    }
    applyFormat(grid, mask);
    var sc = score(grid);
    if (sc < bestScore) {
      bestScore = sc;
      best = grid;
    }
  }
  return { n: N, m: best };
}

'@

function Open-Browser([string]$url) {
  try {
    Start-Process $url
  } catch {
    Write-Host "请在浏览器打开：$url"
  }
}

function Get-LanScore([string]$ip, [string]$name) {
  $score = 50
  if ($ip -like '192.168.*') { $score = 10 }
  elseif ($ip -like '10.*') { $score = 20 }
  elseif ($ip -match '^172\.(1[6-9]|2[0-9]|3[0-1])\.') { $score = 30 }
  $n = ''
  if ($name) { $n = $name.ToLowerInvariant() }
  if ($n -match 'wi-?fi|wlan|wireless|无线') { $score -= 5 }
  if ($n -match 'vethernet|hyper-v|wsl|virtualbox|vmware|docker|bluetooth|蓝牙|loopback') { $score += 40 }
  return $score
}

function Get-LanCandidates {
  $found = @()
  $seen = @{}
  $nics = [System.Net.NetworkInformation.NetworkInterface]::GetAllNetworkInterfaces()
  foreach ($nic in $nics) {
    if ($nic.OperationalStatus -ne [System.Net.NetworkInformation.OperationalStatus]::Up) { continue }
    if ($nic.NetworkInterfaceType -eq [System.Net.NetworkInformation.NetworkInterfaceType]::Loopback) { continue }
    $props = $nic.GetIPProperties()
    foreach ($uni in $props.UnicastAddresses) {
      if ($uni.Address.AddressFamily -ne [System.Net.Sockets.AddressFamily]::InterNetwork) { continue }
      $ip = $uni.Address.ToString()
      if ($ip.StartsWith('127.')) { continue }
      if ($ip.StartsWith('169.254.')) { continue }
      if ($seen.ContainsKey($ip)) { continue }
      $seen[$ip] = $true
      $found += [pscustomobject]@{
        Ip = $ip
        Name = $nic.Name
        Url = "http://${ip}:$port/preview/"
        Score = (Get-LanScore $ip $nic.Name)
      }
    }
  }
  return @($found | Sort-Object Score, Ip, Name)
}

function Try-AllowFirewall {
  if ($env:OS -ne 'Windows_NT') { return $true }
  $name = 'XiaoTuKuaiPao Preview 8647'
  & netsh advfirewall firewall delete rule name="$name" | Out-Null
  & netsh advfirewall firewall add rule name="$name" dir=in action=allow protocol=TCP localport=$port profile=any enable=yes | Out-Null
  return ($LASTEXITCODE -eq 0)
}

function Write-PhoneHelp([bool]$firewallOk) {
  Write-Host ''
  Write-Host '========================================'
  Write-Host '小兔快跑预览已打开'
  Write-Host "这台电脑：$localUrl"
  if ($script:Lan.Count -eq 0) {
    Write-Host ''
    Write-Host '没有发现局域网地址。手机连不上，只能在这台电脑上玩。'
  } else {
    Write-Host ''
    Write-Host '手机和这台电脑连同一个 Wi-Fi，用浏览器打开：'
    foreach ($item in $script:Lan) {
      Write-Host ("  {0}    （{1}）" -f $item.Url, $item.Name)
    }
    Write-Host ''
    Write-Host '电脑上还会打开一张二维码，把手机对准屏幕扫。'
  }
  if (-not $firewallOk) {
    Write-Host ''
    Write-Host '如果手机打不开，多半是 Windows 防火墙拦住了 8647 端口。'
    Write-Host '弹出「Windows 安全中心警报」时，请点「允许访问」。'
    Write-Host '没有弹窗的话：Windows 安全中心 → 防火墙和网络保护 → 允许应用通过防火墙，'
    Write-Host '允许 Windows PowerShell 使用专用网络，或放行 TCP 端口 8647。'
    Write-Host '电脑的网络请设为「专用」。不要用手机流量，也不要连访客 Wi-Fi。'
  }
  Write-Host ''
  Write-Host '关掉这个窗口，预览就停了。'
  Write-Host '========================================'
  Write-Host ''
}

function New-PhonePage {
  $urls = @()
  foreach ($item in $script:Lan) { $urls += $item.Url }
  $jsonParts = @()
  foreach ($u in $urls) { $jsonParts += ('"' + $u + '"') }
  $json = '[' + ($jsonParts -join ',') + ']'
  $links = ''
  $best = ''
  if ($urls.Count -gt 0) { $best = $urls[0] }
  if ($urls.Count -gt 1) {
    $links = '<p>上面打不开，再试这些地址：</p>'
    for ($i = 1; $i -lt $urls.Count; $i++) {
      $links += '<a class="url" href="' + $urls[$i] + '">' + $urls[$i] + '</a>'
    }
  }
  $html = @"
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>用手机打开小兔快跑</title>
  <style>
    body { margin: 0; background: #fff6e8; color: #3a3344; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; }
    main { max-width: 440px; margin: 0 auto; padding: 28px 18px 40px; text-align: center; }
    h1 { font-size: 30px; margin: 0 0 10px; }
    p { font-size: 18px; line-height: 1.55; margin: 10px 0; }
    a.url { display: block; margin: 14px 0; font-size: 22px; line-height: 1.4; word-break: break-all; color: #1d6fbf; }
    #qr { display: inline-block; margin-top: 8px; padding: 12px; background: #fff; border-radius: 16px; }
    #qr table { border-collapse: collapse; }
    #qr td { width: 6px; height: 6px; padding: 0; line-height: 0; }
    a.play { display: inline-block; margin-top: 18px; padding: 12px 22px; border-radius: 999px; background: #ffe38a; color: #3a3344; text-decoration: none; font-weight: 700; }
    .note { color: #6e6578; font-size: 15px; }
  </style>
</head>
<body>
  <main>
    <h1>用手机打开</h1>
    <p>手机和这台电脑连同一个 Wi-Fi。用手机浏览器打开下面的地址，或扫二维码。</p>
    <a class="url" id="best" href="$best">$best</a>
    <div id="qr"></div>
    <div id="more">$links</div>
    <p><a class="play" href="/preview/">在这台电脑上玩</a></p>
    <p class="note">打不开时，看黑色窗口里的说明。关掉那个窗口，预览就停了。</p>
  </main>
  <script>
    var LAN = $json;
    $qrJs
    var link = document.getElementById('best');
    if (LAN.length) {
      link.textContent = LAN[0];
      link.href = LAN[0];
      var qr = makeQrMatrix(LAN[0]);
      if (qr) {
        var html = '<table>';
        var y, x;
        for (y = 0; y < qr.n; y++) {
          html += '<tr>';
          for (x = 0; x < qr.n; x++) {
            html += '<td style="background:' + (qr.m[y][x] ? '#222' : '#fff') + '"></td>';
          }
          html += '</tr>';
        }
        html += '</table>';
        document.getElementById('qr').innerHTML = html;
      }
    }
  </script>
</body>
</html>
"@
  return [Text.Encoding]::UTF8.GetBytes($html)
}

function Read-HttpRequest($stream) {
  $ms = New-Object System.IO.MemoryStream
  $buf = New-Object byte[] 2048
  $idle = 0
  while ($ms.Length -lt 65536) {
    if (-not $stream.DataAvailable) {
      if ($ms.Length -gt 0) { break }
      Start-Sleep -Milliseconds 15
      $idle++
      if ($idle -gt 120) { break }
      continue
    }
    $n = $stream.Read($buf, 0, $buf.Length)
    if ($n -le 0) { break }
    $ms.Write($buf, 0, $n)
    $soFar = [Text.Encoding]::ASCII.GetString($ms.ToArray())
    if ($soFar.Contains("`r`n`r`n")) { break }
  }
  if ($ms.Length -eq 0) { return $null }
  $raw = [Text.Encoding]::ASCII.GetString($ms.ToArray())
  $cut = $raw.IndexOf("`r`n`r`n")
  if ($cut -lt 0) { return $null }
  $lines = $raw.Substring(0, $cut) -split "`r`n"
  if ($lines.Length -lt 1 -or -not $lines[0]) { return $null }
  $parts = $lines[0].Split(' ')
  if ($parts.Length -lt 2) { return $null }
  $headers = @{}
  for ($i = 1; $i -lt $lines.Length; $i++) {
    $colon = $lines[$i].IndexOf(':')
    if ($colon -gt 0) {
      $key = $lines[$i].Substring(0, $colon).Trim().ToLowerInvariant()
      $headers[$key] = $lines[$i].Substring($colon + 1).Trim()
    }
  }
  return @{ Method = $parts[0].ToUpperInvariant(); Target = $parts[1]; Headers = $headers }
}

function Send-Http($stream, [int]$code, [string]$text, [string]$contentType, [byte[]]$body, [bool]$includeBody, [string]$extra) {
  if (-not $body) { $body = New-Object byte[] 0 }
  $head = "HTTP/1.1 $code $text`r`n"
  if ($contentType) { $head += "Content-Type: $contentType`r`n" }
  $head += "Content-Length: $($body.Length)`r`n"
  $head += "Connection: close`r`n"
  $head += "Accept-Ranges: bytes`r`n"
  $head += "Cache-Control: no-cache`r`n"
  if ($extra) { $head += $extra }
  $head += "`r`n"
  $hb = [Text.Encoding]::ASCII.GetBytes($head)
  $stream.Write($hb, 0, $hb.Length)
  if ($includeBody -and $body.Length -gt 0) { $stream.Write($body, 0, $body.Length) }
  $stream.Flush()
}

function Get-ByteRange([string]$header, [long]$length) {
  if (-not $header) { return $null }
  $header = $header.Trim()
  if ($header -notmatch '^bytes=(\d*)-(\d*)$') { return 'invalid' }
  $startText = $Matches[1]
  $endText = $Matches[2]
  if ($startText -eq '' -and $endText -eq '') { return 'invalid' }
  if ($startText -eq '') {
    $count = [long]$endText
    if ($count -le 0) { return 'invalid' }
    if ($count -gt $length) { $count = $length }
    return @{ Start = ($length - $count); End = ($length - 1) }
  }
  $start = [long]$startText
  if ($start -ge $length) { return 'unsatisfiable' }
  if ($start -lt 0) { return 'invalid' }
  $end = $length - 1
  if ($endText -ne '') { $end = [long]$endText }
  if ($end -ge $length) { $end = $length - 1 }
  if ($end -lt $start) { return 'unsatisfiable' }
  return @{ Start = $start; End = $end }
}

function Resolve-PreviewPath([string]$target) {
  $sep = [IO.Path]::DirectorySeparatorChar
  $pathOnly = $target
  $q = $pathOnly.IndexOf('?')
  if ($q -ge 0) { $pathOnly = $pathOnly.Substring(0, $q) }
  $rel = [Uri]::UnescapeDataString($pathOnly.TrimStart('/'))
  if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'preview/index.html' }
  $rel = $rel -replace '/', $sep
  $full = [IO.Path]::GetFullPath((Join-Path $root $rel))
  $rootFull = [IO.Path]::GetFullPath($root)
  $rootPrefix = $rootFull.TrimEnd($sep) + $sep
  if (-not ($full.Equals($rootFull, [StringComparison]::OrdinalIgnoreCase) -or $full.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase))) {
    return @{ Code = 403; Full = $null }
  }
  if (Test-Path -LiteralPath $full -PathType Container) {
    $index = Join-Path $full 'index.html'
    if (Test-Path -LiteralPath $index -PathType Leaf) {
      return @{ Code = 200; Full = $index }
    }
    return @{ Code = 403; Full = $null }
  }
  if (Test-Path -LiteralPath $full -PathType Leaf) {
    return @{ Code = 200; Full = $full }
  }
  return @{ Code = 404; Full = $null }
}

function Serve-Client($client) {
  $stream = $client.GetStream()
  $stream.ReadTimeout = 8000
  try {
    $req = Read-HttpRequest $stream
    if (-not $req) { return }
    $method = $req.Method
    $includeBody = $method -ne 'HEAD'
    if ($method -ne 'GET' -and $method -ne 'HEAD') {
      $msg = [Text.Encoding]::ASCII.GetBytes('Method Not Allowed')
      Send-Http $stream 405 'Method Not Allowed' 'text/plain; charset=utf-8' $msg $includeBody ''
      return
    }
    $sep = [IO.Path]::DirectorySeparatorChar
    $pathOnly = $req.Target
    $qmark = $pathOnly.IndexOf('?')
    if ($qmark -ge 0) { $pathOnly = $pathOnly.Substring(0, $qmark) }
    $rel = [Uri]::UnescapeDataString($pathOnly.TrimStart('/'))
    $relKey = ($rel -replace '\\', '/')
    if ($relKey -eq 'preview/phone.html') {
      $page = New-PhonePage
      Send-Http $stream 200 'OK' 'text/html; charset=utf-8' $page $includeBody ''
      return
    }
    $resolved = Resolve-PreviewPath $req.Target
    if ($resolved.Code -ne 200) {
      $err = [Text.Encoding]::ASCII.GetBytes([string]$resolved.Code)
      $status = 'Not Found'
      if ($resolved.Code -eq 403) { $status = 'Forbidden' }
      Send-Http $stream $resolved.Code $status 'text/plain; charset=utf-8' $err $includeBody ''
      return
    }
    $full = $resolved.Full
    $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
    $contentType = 'application/octet-stream'
    if ($mime.ContainsKey($ext)) { $contentType = $mime[$ext] }
    $bytes = [IO.File]::ReadAllBytes($full)
    $range = Get-ByteRange $req.Headers['range'] $bytes.LongLength
    if ($range -eq 'invalid' -or $range -eq 'unsatisfiable') {
      $empty = New-Object byte[] 0
      $extra = "Content-Range: bytes */$($bytes.LongLength)`r`n"
      Send-Http $stream 416 'Range Not Satisfiable' $contentType $empty $includeBody $extra
      return
    }
    if ($range) {
      $len = [int]($range.End - $range.Start + 1)
      $slice = New-Object byte[] $len
      [Array]::Copy($bytes, [int]$range.Start, $slice, 0, $len)
      $extra = "Content-Range: bytes $($range.Start)-$($range.End)/$($bytes.LongLength)`r`n"
      Send-Http $stream 206 'Partial Content' $contentType $slice $includeBody $extra
      return
    }
    Send-Http $stream 200 'OK' $contentType $bytes $includeBody ''
  } catch {
    try {
      $msg = [Text.Encoding]::ASCII.GetBytes('Error')
      Send-Http $stream 500 'Error' 'text/plain; charset=utf-8' $msg $true ''
    } catch {}
  }
}

$script:Lan = @(Get-LanCandidates)
$firewallOk = $true
try { $firewallOk = Try-AllowFirewall } catch { $firewallOk = $false }

$tcp = New-Object System.Net.Sockets.TcpListener ([System.Net.IPAddress]::Any, $port)
try {
  $tcp.Server.SetSocketOption([System.Net.Sockets.SocketOptionLevel]::Socket, [System.Net.Sockets.SocketOptionName]::ReuseAddress, $true)
} catch {}
try {
  $tcp.Start()
} catch {
  Write-Host '8647 端口已经在用了，直接打开现有的预览。'
  Write-Host '如果手机打不开，先关掉之前那个黑色窗口，再双击一次「打开预览.bat」。'
  Open-Browser $localUrl
  exit 0
}

Write-PhoneHelp $firewallOk
Open-Browser $localUrl
if ($script:Lan.Count -gt 0) {
  Open-Browser "http://127.0.0.1:$port/preview/phone.html"
}

try {
  while ($true) {
    $client = $null
    try {
      $client = $tcp.AcceptTcpClient()
      Serve-Client $client
    } catch {
      $alive = $false
      try { $alive = $tcp.Server.IsBound } catch { $alive = $false }
      if (-not $alive) { break }
    } finally {
      if ($client) {
        try { $client.Close() } catch {}
      }
    }
  }
} finally {
  try { $tcp.Stop() } catch {}
}
