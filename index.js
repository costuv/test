const terminal = document.getElementById('terminal-content');
const input = document.getElementById('terminal-input-box');
const prompt = document.getElementById('prompt');





// Matrix Rain Loading Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
const loadingScreen = document.getElementById('loading-screen');

loadingScreen.style.display = 'flex';
loadingScreen.style.opacity = '1';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Also resize the login matrix canvas when window is resized
window.addEventListener('resize', function() {
  if (loginMatrixCanvas) {
    loginMatrixCanvas.width = loginMatrixCanvas.parentElement.offsetWidth;
    loginMatrixCanvas.height = loginMatrixCanvas.parentElement.offsetHeight;
  }
});

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,./<>?~abcdefghijklmnopqrstuvwxyz';
const fontSize = 20;
const columns = Math.floor(canvas.width / fontSize);
const drops = [];

function drawMatrixRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#8EFF9F';
    ctx.font = `${fontSize}px JetBrains Mono`;
      for (let i = 0; i < drops.length; i++) {
        if (drops[i] > 0) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            if (drops[i] * fontSize < fontSize * 2) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                ctx.fillStyle = '#8EFF9F'; 
            } else {
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            }
        }
        if (Math.random() > 0.3) {
            drops[i]++;
        }
    
        if (drops[i] === 0 && Math.random() > 0.975) {
            drops[i] = 1;
        }
        
        if (drops[i] * fontSize > canvas.height) {
            drops[i] = 0;
        }
    }
}

function animateMatrix() {
    drawMatrixRain();
    setTimeout(() => {
        requestAnimationFrame(animateMatrix);
    }, 80);
}

for (let i = 0; i < columns; i++) {
    drops[i] = 0; 
}

requestAnimationFrame(animateMatrix);

setTimeout(() => {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.8s ease-out';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 800);
}, 3000);





// Typewriter animation effect for the titles
const typewriterElement = document.getElementById('typewriter');
const cursor = document.querySelector('.cursor');
const titles = ["Game Developer.", "Musician.", "Gamer.", "Video Editor.", "Human?"];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100; 

function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; 
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500;
    }
    cursor.style.animation = isDeleting ? 'none' : 'blink 1s infinite';
    setTimeout(typeEffect, typingSpeed);
}
setTimeout(typeEffect, 1000);









let username = localStorage.getItem('name');
let state = username ? 'mainMenu' : 'askName';
function scrollTerminal() {
  terminal.scrollTop = terminal.scrollHeight;
}
// Reference to the split terminal elements
const splitTerminal = document.getElementById('split-terminal');
const gameTerminal = document.getElementById('game-terminal');
const gameTerminalContent = document.getElementById('game-terminal-content');
const gamePrompt = document.getElementById('game-prompt');
const gameInput = document.getElementById('game-terminal-input');
const loginScreen = document.getElementById('login-screen');

// Function to scroll the game terminal content
function scrollGameTerminal() {
  gameTerminalContent.scrollTop = gameTerminalContent.scrollHeight;
}

const commands = {
  start: function() {
    terminal.innerHTML += `<div class="system-message">Adventure starting...</div>`;
    terminal.innerHTML += `<div class="system-message">Launching interface...</div>`;
    scrollTerminal();
    
    // Initialize the file system if not already initialized
    if (!fileSystem.structure['/home/user'] || Object.keys(fileSystem.structure['/home/user'].children).length === 0) {
      fileSystem.generateFileSystem();
    } else {
      // Just regenerate credentials in existing file system
      console.log("File system already exists, regenerating credentials only");
      fileSystem.placeCredentialsInFiles();
      fileSystem.verifyCredentialsPlacement();
    }
    
    // Hide the regular terminal
    document.querySelector('.terminal-input-container').style.display = 'none';
    terminal.style.display = 'none';
    
    // Show the game loading screen
    const gameLoadingScreen = document.getElementById('game-loading-screen');
    gameLoadingScreen.style.display = 'flex';
    
    // Initialize and start the game matrix rain
    initGameMatrixRain();
    
    // Prepare the split terminal in the background
    splitTerminal.style.display = 'block';
    splitTerminal.style.opacity = '0';
    splitTerminal.style.pointerEvents = 'none';
    
    // Copy the username to the game terminal prompt
    gamePrompt.innerHTML = `${username.toLowerCase()}@costuv.tech:~$ `;
    
    // Add welcome message to game terminal
    gameTerminalContent.innerHTML = `<div class="system-message">Welcome to the adventure, ${username}!</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">Type 'help' to see available commands</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">Try using the 'ls' command to see what files are available.</div>`;
    
    // Setup game terminal input event listener
    gameInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const value = gameInput.value.trim();
        if (!value) return;
        
        processGameCommand(value);
        gameInput.value = '';
      }
    });
    
    // Show the split terminal after a brief delay (when everything is ready)
    setTimeout(() => {
      // Hide the game loading screen and show the split terminal
      splitTerminal.style.opacity = '1';
      splitTerminal.style.pointerEvents = 'auto';
      splitTerminal.style.transition = 'opacity 0.6s ease-in';
      
      // Wait a bit more to ensure the transition is smooth
      setTimeout(() => {
        gameLoadingScreen.style.opacity = '0';
        gameLoadingScreen.style.transition = 'opacity 0.8s ease-out';
        
        setTimeout(() => {
          gameLoadingScreen.style.display = 'none';
          
          // Focus on the game terminal input
          gameInput.focus();
          scrollGameTerminal();
        }, 800);
      }, 600);
    }, 3000);
  },
  reset: function() {
    localStorage.removeItem('name');
    terminal.innerHTML += `<div class="system-message">Name reset. Please enter your name:</div>`;
    input.placeholder = "Type your name...";
    state = 'askName';
    scrollTerminal();
  },
  help: function() {
    terminal.innerHTML += `<div class="system-message">Available commands:</div>`;
    terminal.innerHTML += `<div class="system-message">start - Begin your adventure</div>`;
    terminal.innerHTML += `<div class="system-message">reset - Change your name</div>`;
    terminal.innerHTML += `<div class="system-message">help - Show this help message</div>`;
    terminal.innerHTML += `<div class="system-message">clear - Clear the terminal</div>`;
    terminal.innerHTML += `<div class="system-message">exit - Exit and refresh the system</div>`;
    scrollTerminal();
  },
  clear: function() {
    terminal.innerHTML = '';
  },
  exit: function() {
    // Inform the user that the page will refresh
    terminal.innerHTML += `<div class="system-message">Exiting and refreshing the system...</div>`;
    scrollTerminal();
    
    // Set a short timeout to allow the message to be seen before refreshing
    setTimeout(() => {
      // Refresh the entire page
      window.location.reload();
    }, 1500);
  },
};

// Game terminal commands
const gameCommands = {
  help: function() {
    gameTerminalContent.innerHTML += `<div class="system-message">Available game commands:</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">ls - List directory contents</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">cd - Change directory</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">pwd - Print working directory</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">cat - Display file contents</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">exit - Exit and refresh the system</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">clear - Clear the terminal</div>`;
    scrollGameTerminal();
  },
  clear: function() {
    gameTerminalContent.innerHTML = '';
  },  exit: function() {
    // Inform the user that the page will refresh
    gameTerminalContent.innerHTML += `<div class="system-message">Exiting and refreshing the system...</div>`;
    scrollGameTerminal();
    
    // Set a short timeout to allow the message to be seen before refreshing
    setTimeout(() => {
      // Refresh the entire page
      window.location.reload();
    }, 1500);
  }
};

// Process commands in the game terminal
function processGameCommand(cmd) {
  const currentDir = fileSystem.currentPath.replace('/home/user', '~');
  gameTerminalContent.innerHTML += `<div class="command-line">${username.toLowerCase()}@costuv.tech:${currentDir}$ <span class="system-message">${cmd}</span></div>`;
  
  const command = cmd.toLowerCase().trim().split(/\s+/)[0];
  
  // First try to process it as a file system command
  if (processFileSystemCommand(cmd)) {
    // Command was handled by the file system processor
    // Update the prompt with the current path
    const updatedPath = fileSystem.currentPath.replace('/home/user', '~');
    gamePrompt.innerHTML = `${username.toLowerCase()}@costuv.tech:${updatedPath}$ `;
  } else if (gameCommands[command]) {
    // Otherwise, check if it's a game command
    gameCommands[command]();
  } else {
    gameTerminalContent.innerHTML += `<div class="system-message">Unknown command: ${command}</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">Type 'help' to see available commands</div>`;
  }
  
  scrollGameTerminal();
}

// Setup game time display
function updateGameTime() {
  const timeDisplay = document.querySelector('.time-display');
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  const secondsStr = seconds < 10 ? '0' + seconds : seconds;
  
  timeDisplay.textContent = hours + ':' + minutesStr + ':' + secondsStr + ' ' + ampm;
}

// Update game time initially and every second
updateGameTime();
setInterval(updateGameTime, 1000);

// Setup login button functionality
document.getElementById('login-button').addEventListener('click', attemptLogin);
document.getElementById('password').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    attemptLogin();
  }
});

// Initialize the matrix rain effect for login screen
const loginMatrixCanvas = document.getElementById('login-matrix-canvas');
const loginMatrixCtx = loginMatrixCanvas ? loginMatrixCanvas.getContext('2d') : null;
const loginMatrixDrops = [];

function setupLoginMatrixRain() {
  if (!loginMatrixCanvas) return;
  
  loginMatrixCanvas.width = loginMatrixCanvas.parentElement.offsetWidth;
  loginMatrixCanvas.height = loginMatrixCanvas.parentElement.offsetHeight;
  
  const loginColumns = Math.floor(loginMatrixCanvas.width / fontSize);
  
  // Initialize drops
  for (let i = 0; i < loginColumns; i++) {
    loginMatrixDrops[i] = Math.floor(Math.random() * -100);
  }
  
  // Start animation
  animateLoginMatrix();
}

function animateLoginMatrix() {
  if (!loginMatrixCanvas || !loginMatrixCtx) return;
  
  loginMatrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  loginMatrixCtx.fillRect(0, 0, loginMatrixCanvas.width, loginMatrixCanvas.height);
  
  loginMatrixCtx.fillStyle = '#8EFF9F';
  loginMatrixCtx.font = `${fontSize}px JetBrains Mono`;
  
  for (let i = 0; i < loginMatrixDrops.length; i++) {
    if (loginMatrixDrops[i] > 0) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      loginMatrixCtx.fillText(text, i * fontSize, loginMatrixDrops[i] * fontSize);
    }
    
    if (Math.random() > 0.975) {
      loginMatrixDrops[i]++;
    }
    
    if (loginMatrixDrops[i] * fontSize > loginMatrixCanvas.height && Math.random() > 0.95) {
      loginMatrixDrops[i] = 0;
    } else {
      loginMatrixDrops[i]++;
    }
  }
  
  requestAnimationFrame(animateLoginMatrix);
}

// Start the login matrix rain when the split terminal is shown
document.addEventListener('DOMContentLoaded', function() {
  // Check if we should setup the login matrix rain
  if (splitTerminal && splitTerminal.style.display !== 'none') {
    setTimeout(setupLoginMatrixRain, 500);
  }
});

// Game login logic
function attemptLogin() {
  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value.trim();
  
  // Check if both fields are filled
  if (!usernameInput || !passwordInput) {
    gameTerminalContent.innerHTML += `<div class="system-message">Error: Both username and password are required.</div>`;
    scrollGameTerminal();
    return;
  }
  
  // Scan the file system for the hidden credentials
  const creds = fileSystem.scanFilesForCredentials();
  const correctUsername = creds.username ? creds.username : '';
  const correctPassword = creds.password ? creds.password : '';
  
  console.log(`Checking login with username: ${usernameInput}, password: ${passwordInput}`);
  console.log(`Correct credentials: username=${correctUsername}, password=${correctPassword}`);
  
  if (usernameInput === correctUsername && passwordInput === correctPassword) {
    // Success - Show the success animation
    const successOverlay = document.querySelector('.login-success-overlay');
    successOverlay.classList.add('active');
    
    // Setup continue button
    document.querySelector('.continue-button').addEventListener('click', function() {
      // Hide the login success overlay
      successOverlay.classList.remove('active');
      
      // Hide the login screen (this happens automatically in the terminal)
      loginScreen.style.display = 'none';
      
      // Show the game terminal side instead
      gameTerminal.style.display = 'block';
      
      // Focus on the game terminal input
      gameInput.focus();
    });
    
    // Update terminal with success message (behind the scenes)
    gameTerminalContent.innerHTML += `
      <div class="system-message success-message" style="color:#8EFF9F;font-weight:bold;font-size:1.2em;margin-top:16px;">
        <span style="font-size:1.5em; animation: pop-tick 0.7s cubic-bezier(.68,-0.55,.27,1.55); display:inline-block;">✔️</span> ACCESS GRANTED!<br>
        <span>Welcome, <b>${usernameInput}</b>! You have successfully cracked the login.<br>
        <span style="color:#fff;">Secret files are being unlocked...</span><br>
        <span style="color:#FFD700;">Mission objectives updated. Type <b>mission</b> to view them.</span>
      </div>
      <style>@keyframes pop-tick {0%{transform:scale(0.2) rotate(-30deg);} 60%{transform:scale(1.2) rotate(10deg);} 80%{transform:scale(0.95) rotate(-5deg);} 100%{transform:scale(1) rotate(0deg);}}</style>
    `;
    
    scrollGameTerminal();
  } else {
    // Failed login
    gameTerminalContent.innerHTML += `<div class="system-message">Access denied. Invalid credentials for user: ${usernameInput}</div>`;
    gameTerminalContent.innerHTML += `<div class="system-message">Hint: Check the terminal for clues.</div>`;
    
    // After 3 failed attempts, give a hint
    if (!window.loginAttempts) window.loginAttempts = 1;
    else window.loginAttempts++;
    
    if (window.loginAttempts >= 3) {
      gameTerminalContent.innerHTML += `<div class="system-message">Security breach detected! Try user: admin</div>`;
    }
    
    scrollGameTerminal();
  }
}

if (username) {
    terminal.innerHTML += `<div class="system-message">Welcome back, ${username}!</div>`;
    terminal.innerHTML += `<div class="system-message">Type 'help' to see available commands</div>`;
    input.placeholder = "Type 'start' to begin or 'help' to see available commands.";
    prompt.innerHTML = `${username.toLowerCase()}@costuv.tech:~$ `;
    scrollTerminal();
} else {
    terminal.innerHTML += `<div class="system-message">Please enter your name:</div>`;
    input.placeholder = "Type your name...";
    prompt.innerHTML = `$`;
    scrollTerminal();
}

function processCommand(cmd) {
  terminal.innerHTML += `<div class="command-line">${username ? username.toLowerCase() : ''}@costuv.tech:~$ <span class="system-message">${cmd}</span></div>`;
  if (state === 'askName') {
    if(/\s/.test(cmd)) {
      terminal.innerHTML += `<div class="system-message">Error: Name cannot contain spaces.</div>`;
      input.placeholder = "Type your name...";
      scrollTerminal();
      return;
    }
    username = cmd;
    terminal.innerHTML += `<div class="system-message">Welcome, ${cmd}!</div>`;
    terminal.innerHTML += `<div class="system-message">Type 'help' to see available commands</div>`;
    localStorage.setItem('name', cmd);
    input.placeholder = "Type 'help' to see available commands. Auto fill is enabled.";
    prompt.innerHTML = `${username.toLowerCase()}@costuv.tech:~$ `;
    state = 'mainMenu';
  } 
  else if (state === 'mainMenu') {
    const command = cmd.toLowerCase();
    
    if (commands[command]) {
      commands[command]();
    } else {
      terminal.innerHTML += `<div class="system-message">Unknown command: ${cmd}</div>`;
      terminal.innerHTML += `<div class="system-message">Type 'help' to see available commands</div>`;
    }
  }
  scrollTerminal();
}






input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const value = input.value.trim();
        if (!value) return;
        
        processCommand(value);
        input.value = '';
    }
});
// --- FILE SYSTEM REFACTOR START ---
const fileSystem = {
  credentials: {
    username: "",
    password: ""
  },
  structure: {},
  currentPath: '/home/user',

  generateCredentials() {
    const possibleUsernames = ['admin', 'user', 'guest', 'hacker', 'coder', 'developer', 'sysadmin', 'root', 'testuser', 'anonymous', 'user123', 'user456', 'user789'];
    this.credentials.username = possibleUsernames[Math.floor(Math.random() * possibleUsernames.length)];
    const passwordLength = Math.floor(Math.random() * 3) + 4; // 4 to 6 characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (Math.random() < 0.5) {
      password += Math.floor(Math.random() * 10);
    }
    this.credentials.password = password;
    return { username: this.credentials.username, password: this.credentials.password };
  },

  getUniqueNames(count, type, parentDir) {
    // Expanded file name options with more variety
    const fileNamesByType = {
      config: ['config', 'settings', 'preferences', 'options', 'setup', 'parameters', 'env', 'globals', 'vars', 'profile', 'registry', 'defaults'],
      log: ['log', 'debug', 'error', 'warning', 'info', 'trace', 'events', 'activity', 'system', 'audit', 'monitor', 'report', 'alerts'],
      data: ['data', 'records', 'entries', 'stats', 'metrics', 'analytics', 'results', 'output', 'exports', 'table', 'collection', 'index', 'values'],
      document: ['readme', 'guide', 'manual', 'doc', 'instructions', 'reference', 'specs', 'overview', 'howto', 'tutorial', 'notes', 'summary', 'faq', 'help'],
      code: ['script', 'module', 'component', 'class', 'function', 'helper', 'utility', 'plugin', 'extension', 'handler', 'controller', 'service', 'model'],
      project: ['project', 'app', 'service', 'api', 'backend', 'frontend', 'client', 'server', 'interface', 'framework', 'platform', 'solution', 'prototype'],
      backup: ['backup', 'archive', 'snapshot', 'copy', 'dump', 'export', 'store', 'cache', 'temp', 'old', 'saved', 'history', 'recovery'],
      executable: ['program', 'app', 'setup', 'installer', 'launcher', 'tool', 'utility', 'cmd', 'exec', 'run', 'start', 'manager'],
      media: ['image', 'photo', 'picture', 'screenshot', 'thumbnail', 'avatar', 'icon', 'logo', 'banner', 'background', 'wallpaper'],
      audio: ['track', 'song', 'audio', 'music', 'sound', 'recording', 'podcast', 'voice', 'stream', 'clip', 'sample', 'mix'],
      video: ['video', 'movie', 'clip', 'recording', 'stream', 'episode', 'trailer', 'preview', 'demo', 'tutorial', 'presentation']
    };

    // Expanded file extensions
    const fileExtensions = {
      config: ['.conf', '.cfg', '.ini', '.json', '.yaml', '.yml', '.xml', '.env', '.properties', '.toml', '.config'],
      log: ['.log', '.txt', '.out', '.err', '.debug', '.trace', '.report'],
      data: ['.dat', '.json', '.csv', '.xml', '.db', '.sql', '.xlsx', '.tsv', '.yaml', '.sqlite'],
      document: ['.md', '.txt', '.pdf', '.doc', '.rtf', '.odt', '.docx', '.pages', '.tex', '.rst'],
      code: ['.js', '.py', '.rb', '.php', '.java', '.c', '.cpp', '.sh', '.html', '.css', '.ts', '.go', '.rs', '.swift', '.kotlin'],
      project: ['.json', '.yaml', '.xml', '.md', '.properties', '.config', '.project', '.csproj', '.sln'],
      backup: ['.bak', '.old', '.save', '.archive', '.zip', '.tar', '.gz', '.7z', '.rar', '.bkp'],
      executable: ['.exe', '.app', '.bat', '.sh', '.cmd', '.msi', '.run', '.bin', '.AppImage'],
      media: ['.jpg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico', '.tiff', '.heif', '.raw'],
      audio: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma', '.mid', '.opus'],
      video: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpeg']
    };

    // Expanded folder names
    const folderNames = [
      // System and configuration folders
      'config', 'settings', 'preferences', 'system', 'registry', 'defaults',
      
      // Standard folders
      'logs', 'data', 'backup', 'archive', 'temp', 'src', 'lib', 'modules',
      'utils', 'docs', 'resources', 'assets', 'media', 'scripts', 'tools', 'plugins',
      
      // User and content folders
      'services', 'api', 'web', 'app', 'server', 'client', 'public', 'private',
      'internal', 'external', 'shared', 'common', 'core', 'main', 'test',
      
      // Build and deployment folders
      'build', 'dist', 'release', 'development', 'production', 'staging',
      
      // Security-related folders
      'secure', 'auth', 'access', 'users', 'profiles', 'accounts', 'admin',
      
      // Management and organization folders
      'management', 'control', 'network', 'platform', 'framework',
      'infrastructure', 'projects', 'workspace',
      
      // Common user folders
      'downloads', 'uploads', 'favorites', 'bookmarks', 'saved', 'recents',
      
      // Specific content type folders
      'images', 'photos', 'pictures', 'videos', 'music', 'audio', 'podcasts',
      'documents', 'spreadsheets', 'presentations', 'pdfs', 'ebooks',
      
      // Project-specific folders
      'source', 'libraries', 'dependencies', 'packages', 'components', 'models',
      'views', 'controllers', 'helpers', 'middleware', 'tests', 'examples',
      
      // More specific application folders
      'cache', 'trash', 'logs', 'backups', 'updates', 'installers', 'drivers',
      'games', 'applications', 'programs', 'utilities', 'tools'
    ];

    // Add specific types for different directories
    const specificFoldersByDir = {
      desktop: ['shortcuts', 'workspace', 'projects', 'games', 'applications', 'quick_access', 'favorites', 'temp'],
      documents: ['reports', 'work', 'personal', 'school', 'important', 'templates', 'contracts', 'letters', 'forms'],
      pictures: ['screenshots', 'wallpapers', 'photos', 'camera', 'drawings', 'memes', 'art', 'backgrounds', 'profile_pics'],
      music: ['playlists', 'albums', 'artists', 'genres', 'favorites', 'downloaded', 'podcasts', 'recordings', 'mixes'],
      videos: ['movies', 'tv_shows', 'tutorials', 'recordings', 'clips', 'edits', 'shorts', 'streams', 'projects']
    };

    // For specific executable types on desktop
    const executableTypes = [
      'setup', 'installer', 'game', 'app', 'launcher', 'browser', 'utility', 'tool', 'player', 'manager', 'editor'
    ];

    let namePool;
    if (type === 'directory') {
      // Add some specific folder types based on parent directory if provided
      const parentDir = arguments[2]; // Optional third argument for parent directory name
      
      if (parentDir && specificFoldersByDir[parentDir]) {
        // Use 70% specific folder names and 30% general folder names
        namePool = [...specificFoldersByDir[parentDir]];
        if (Math.random() < 0.3) {
          namePool = namePool.concat([...folderNames].sort(() => Math.random() - 0.5).slice(0, folderNames.length / 2));
        }
      } else {
        namePool = [...folderNames];
      }
      
      // Shuffle the array
      namePool.sort(() => Math.random() - 0.5);
      
      // Generate unique folder names
      const selectedNames = [];
      for (let i = 0; i < count; i++) {
        // Add a random suffix 40% of the time
        const name = namePool[i % namePool.length];
        const suffix = Math.random() < 0.4 ? '_' + Math.floor(Math.random() * 100) : '';
        selectedNames.push(name + suffix);
      }
      
      return selectedNames;
    } else {
      // For files, choose a random category and generate filename with extension
      const parentDir = arguments[2]; // Optional third argument for parent directory name
      const selectedNames = [];
      
      // For the desktop, add some executables
      if (parentDir === 'desktop' && Math.random() < 0.5) {
        const execCount = Math.min(count, Math.floor(Math.random() * 2) + 1); // 1-2 executables
        
        for (let i = 0; i < execCount; i++) {
          const execName = executableTypes[Math.floor(Math.random() * executableTypes.length)];
          const suffix = Math.random() < 0.5 ? '_' + Math.floor(Math.random() * 100) : '';
          selectedNames.push(execName + suffix + '.exe');
        }
      }
      
      // Add regular files for the remainder
      const types = Object.keys(fileNamesByType);
      const remainingCount = count - selectedNames.length;
      
      for (let i = 0; i < remainingCount; i++) {
        // Select file type based on directory
        let fileType;
        
        if (parentDir) {
          switch(parentDir) {
            case 'pictures':
              fileType = Math.random() < 0.8 ? 'media' : types[Math.floor(Math.random() * types.length)];
              break;
            case 'music':
              fileType = Math.random() < 0.8 ? 'audio' : types[Math.floor(Math.random() * types.length)];
              break;
            case 'videos':
              fileType = Math.random() < 0.8 ? 'video' : types[Math.floor(Math.random() * types.length)];
              break;
            case 'documents':
              fileType = Math.random() < 0.7 ? 'document' : types[Math.floor(Math.random() * types.length)];
              break;
            default:
              fileType = types[Math.floor(Math.random() * types.length)];
          }
        } else {
          fileType = types[Math.floor(Math.random() * types.length)];
        }
        
        const baseName = fileNamesByType[fileType][Math.floor(Math.random() * fileNamesByType[fileType].length)];
        const extension = fileExtensions[fileType][Math.floor(Math.random() * fileExtensions[fileType].length)];
        
        // Add a random suffix to ensure uniqueness
        const suffix = Math.random() < 0.4 ? '_' + Math.floor(Math.random() * 1000) : '';
        selectedNames.push(baseName + suffix + extension);
      }
      
      return selectedNames;
    }
  },

  generateFileContent(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
    
    const contentTypes = {
      conf: () => `# Configuration file\n# Last updated: ${randomDate}\n\nport=808${Math.floor(Math.random() * 10)}\nhost=127.0.0.1\ndebug=${Math.random() > 0.5 ? 'true' : 'false'}\nmax_connections=${Math.floor(Math.random() * 100) + 10}\ntimeout=${Math.floor(Math.random() * 30) + 5}`,
      
      cfg: () => `; System configuration\n; Auto-generated\n\n[General]\nVersion=1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}\nEnvironment=${['dev', 'staging', 'prod'][Math.floor(Math.random() * 3)]}\n\n[Network]\nAllowRemote=${Math.random() > 0.5 ? 'yes' : 'no'}\nFirewall=${Math.random() > 0.5 ? 'enabled' : 'disabled'}`,
      
      json: () => {
        const obj = {
          id: Math.floor(Math.random() * 10000),
          name: ['system', 'app', 'server', 'client', 'service'][Math.floor(Math.random() * 5)],
          enabled: Math.random() > 0.3,
          timestamp: randomDate,
          config: {
            verbose: Math.random() > 0.5,
            retries: Math.floor(Math.random() * 5) + 1
          }
        };
        return JSON.stringify(obj, null, 2);
      },
      
      log: () => {
        let logContent = "";
        const logCount = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < logCount; i++) {
          const logDate = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString();
          const logLevel = ['INFO', 'WARN', 'ERROR', 'DEBUG'][Math.floor(Math.random() * 4)];
          const logMessages = [
            'System startup complete',
            'User authentication attempt',
            'Database connection established',
            'Failed to load module',
            'Security scan complete',
            'Network connection lost',
            'Cache refresh triggered',
            'Config file loaded'
          ];
          logContent += `[${logDate}] [${logLevel}] ${logMessages[Math.floor(Math.random() * logMessages.length)]}\n`;
        }
        return logContent;
      },
      
      txt: () => {
        const notes = [
          "Remember to update the security certificates next month.",
          "System backup scheduled for every Friday at midnight.",
          "Default credentials should be changed after initial login.",
          "Network maintenance window: 2AM-4AM on the last Sunday of each month.",
          "All team members must use two-factor authentication.",
          "The emergency recovery procedure is documented in the admin manual.",
          "Critical security patches must be applied within 48 hours.",
          "Data retention policy: logs kept for 90 days, backups for 1 year."
        ];
        
        const selectedNotes = [];
        const noteCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < noteCount; i++) {
          const index = Math.floor(Math.random() * notes.length);
          selectedNotes.push(notes[index]);
          notes.splice(index, 1);
        }
        
        return `NOTES:\n\n${selectedNotes.join('\n\n')}`;
      },
      
      md: () => {
        return `# System Documentation\n\n## Overview\nThis document provides information about system configuration and usage.\n\n## Usage\n- Access requires proper authentication\n- Commands are case-sensitive\n- Use 'help' to see available options\n\n## Known Issues\n- Occasional timeout during peak hours\n- Reports may be delayed by up to 5 minutes`;
      },
      
      sh: () => `#!/bin/bash\n\n# Maintenance script\n# Run with caution\n\necho "Starting system check..."\nsleep 2\necho "Checking disk space..."\ndf -h\necho "Checking memory usage..."\nfree -m\necho "Done!"`,
      
      py: () => `#!/usr/bin/env python3\n\n# Utility script\n\ndef main():\n    print("System utility")\n    # TODO: Implement functionality\n    print("No issues found")\n\nif __name__ == "__main__":\n    main()`,
      
      js: () => `// System utility functions\n\n/**\n * Performs system check\n * @return {boolean} Status of check\n */\nfunction systemCheck() {\n  console.log("Running diagnostics...");\n  // TODO: Implement actual checks\n  return true;\n}\n\nmodule.exports = { systemCheck };`,
      
      html: () => `<!DOCTYPE html>\n<html>\n<head>\n  <title>System Dashboard</title>\n</head>\n<body>\n  <h1>System Status</h1>\n  <p>All systems operational</p>\n  <ul>\n    <li>CPU: Normal</li>\n    <li>Memory: 42% used</li>\n    <li>Disk: 67% used</li>\n  </ul>\n</body>\n</html>`,
      
      css: () => `/* Dashboard styles */\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}\n\n.status {\n  padding: 10px;\n  border: 1px solid #ddd;\n  background-color: #f9f9f9;\n}`,
      
      sql: () => `-- Database schema\n\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  username VARCHAR(50) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE logs (\n  id INTEGER PRIMARY KEY,\n  user_id INTEGER,\n  action VARCHAR(100),\n  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (user_id) REFERENCES users(id)\n);`,
      
      xml: () => `<?xml version="1.0" encoding="UTF-8"?>\n<configuration>\n  <system>\n    <name>Main Server</name>\n    <version>2.1.4</version>\n  </system>\n  <settings>\n    <setting name="debug" value="false" />\n    <setting name="timeout" value="30" />\n  </settings>\n</configuration>`
    };
    
    // Default content if extension isn't specified
    const defaultContent = () => `System file: ${fileName}\nCreated: ${randomDate}\n\nThis file contains system data.`;
    
    // Get the appropriate content generator based on extension, or use default
    for (const ext in contentTypes) {
      if (extension === ext) {
        return contentTypes[ext]();
      }
    }
    
    // Check for extension groups
    if (['jpg', 'png', 'gif', 'svg'].includes(extension)) {
      return `[BINARY IMAGE DATA]\nImage file: ${fileName}\nCreated: ${randomDate}\nSize: ${Math.floor(Math.random() * 1000) + 100}KB`;
    } 
    else if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
      return `[BINARY AUDIO DATA]\nAudio file: ${fileName}\nDuration: ${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}\nSize: ${Math.floor(Math.random() * 10) + 1}MB`;
    } 
    else if (['mp4', 'avi', 'mov', 'mkv'].includes(extension)) {
      return `[BINARY VIDEO DATA]\nVideo file: ${fileName}\nDuration: ${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}\nResolution: ${['720p', '1080p', '4K'][Math.floor(Math.random() * 3)]}\nSize: ${Math.floor(Math.random() * 100) + 10}MB`;
    }
    
    return defaultContent();
  },

  // MAIN: Generate the file system structure
  generateFileSystem() {
    this.structure = {
      '/home/user': {
        type: 'directory',
        children: {
          'desktop': { type: 'directory', children: {} },
          'documents': { type: 'directory', children: {} },
          'pictures': { type: 'directory', children: {} },
          'music': { type: 'directory', children: {} },
          'videos': { type: 'directory', children: {} }
        }
      }
    };
    this.generateRandomContentForAllDirectories();
    this.placeCredentialsInFiles();
    this.currentPath = '/home/user';
    // DEBUG: Output structure to UI for confirmation
    if (typeof gameTerminalContent !== 'undefined') {
      let debugOut = '<div class="system-message"><b>DEBUG: File system generated:</b><br>';
      const mainDirs = ['desktop', 'documents', 'pictures', 'music', 'videos'];
      mainDirs.forEach(dir => {
        debugOut += `<b>${dir}/</b><br>`;
        const dirObj = this.structure['/home/user'].children[dir].children;
        Object.keys(dirObj).forEach(sub => {
          if (dirObj[sub].type === 'directory') {
            debugOut += `&nbsp;&nbsp;<span class='directory'>${sub}/</span><br>`;
            Object.keys(dirObj[sub].children).forEach(f => {
              debugOut += `&nbsp;&nbsp;&nbsp;&nbsp;<span class='file'>${f}</span><br>`;
            });
          } else {
            debugOut += `&nbsp;&nbsp;<span class='file'>${sub}</span><br>`;
          }
        });
      });
      debugOut += '</div>';
      gameTerminalContent.innerHTML += debugOut;
    }
    return this.structure;
  },

  // Generate random content for all main directories
  generateRandomContentForAllDirectories() {
    const mainDirs = ['desktop', 'documents', 'pictures', 'music', 'videos'];
    mainDirs.forEach(dir => {
      const dirObj = this.structure['/home/user'].children[dir].children;
      // Clear
      for (const k in dirObj) delete dirObj[k];
      // Add 1 subfolder only
      const subfolderCount = 1;
      const subfolderNames = this.getUniqueNames(subfolderCount, 'directory', dir);
      subfolderNames.forEach(subName => {
        dirObj[subName] = { type: 'directory', children: {} };
        // Each subfolder: 1 file only
        const fileCount = 1;
        const fileNames = this.getUniqueNames(fileCount, 'file', dir);
        fileNames.forEach(f => {
          dirObj[subName].children[f] = { type: 'file', content: this.generateFileContent(f) };
        });
      });
      // Optionally: add 1 file directly in main folder (50% chance)
      if (Math.random() > 0.5) {
        const mainFileCount = 1;
        const mainFileNames = this.getUniqueNames(mainFileCount, 'file', dir);
        mainFileNames.forEach(f => {
          dirObj[f] = { type: 'file', content: this.generateFileContent(f) };
        });
      }
      // DEBUG: Log the generated structure for this main directory
      console.log(`Generated structure for ${dir}:`, JSON.parse(JSON.stringify(dirObj)));
    });
  },

  // Place credentials in random files
  placeCredentialsInFiles() {
    const creds = this.generateCredentials();
    const allFilePaths = this.getAllFilePaths('/home/user');
    if (allFilePaths.length < 2) return;
    const shuffledPaths = [...allFilePaths].sort(() => Math.random() - 0.5);
    this.insertCredentialInFile(shuffledPaths[0], 'username', creds.username);
    this.insertCredentialInFile(shuffledPaths[1], 'password', creds.password);
  },

  getAllFilePaths(startPath, currentPaths = []) {
    const dirContents = this.getDirectoryContents(startPath);
    if (!dirContents) return currentPaths;
    Object.keys(dirContents).forEach(item => {
      const itemObj = dirContents[item];
      const itemPath = `${startPath}/${item}`;
      if (itemObj.type === 'directory') {
        this.getAllFilePaths(itemPath, currentPaths);
      } else if (itemObj.type === 'file') {
        currentPaths.push(itemPath);
      }
    });
    return currentPaths;
  },

  getDirectoryContents(path) {
    console.log(`Getting directory contents for path: ${path}`);
    // Special case for root path
    if (path === '/home/user') {
      console.log('Root path detected, returning:', Object.keys(this.structure['/home/user'].children));
      return this.structure['/home/user'].children;
    }
    const parts = path.split('/').filter(p => p);
    let current = this.structure;
    console.log(`Path parts:`, parts);
    // Navigate to the specified directory
    if (parts[0] === 'home' && parts[1] === 'user') {
      current = this.structure['/home/user'].children;
      for (let i = 2; i < parts.length; i++) {
        const part = parts[i];
        console.log(`Processing part: ${part}, current keys:`, current ? Object.keys(current) : 'null');
        if (current[part] && current[part].type === 'directory') {
          current = current[part].children;
          console.log(`Navigated to ${part} children`);
        } else {
          console.log(`Failed to navigate to ${part}`);
          return null;
        }
      }
    } else {
      // fallback for any other path
      console.log('Failed to navigate: path does not start with /home/user');
      return null;
    }
    console.log(`Found directory contents:`, current ? Object.keys(current) : 'null');
    return current;
  },
  
  insertCredentialInFile(filePath, credType, credValue) {
    const fileExt = filePath.split('.').pop().toLowerCase();
    const fileName = filePath.split('/').pop();
    const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
    
    // Get the directory containing the file
    const dirContents = this.getDirectoryContents(dirPath);
    if (!dirContents) return false;
    
    // Get the file
    const fileObj = dirContents[fileName];
    if (!fileObj || fileObj.type !== 'file') return false;
    
    // Get the current content
    let content = fileObj.content;
    
    // Insert the credential based on file type
    switch (fileExt) {
      case 'txt':
      case 'md':
        if (credType === 'username') {
          content += `\n\nSystem ${credType}: ${credValue}\n`;
        } else {
          content += `\n\nSecure ${credType}: ${credValue}\n`;
        }
        break;
        
      case 'js':
      case 'html':
      case 'css':
        if (credType === 'username') {
          content += `\n\n// ${credType} for secure access: ${credValue}\n`;
        } else {
          content += `\n\n// ${credType} for secure access: ${credValue}\n`;
        }
        break;
        
      case 'json':
        // Remove the closing brace and add the credential
        content = content.replace(/\}\s*$/, '');
        if (content.trim().endsWith(',')) {
          content += `\n  "${credType}": "${credValue}"\n}`;
        } else {
          content += `,\n  "${credType}": "${credValue}"\n}`;
        }
        break;
        
      case 'log':
        if (credType === 'username') {
          content += `\n[INFO] ${new Date().toISOString()} - User created: ${credValue}`;
        } else {
          content += `\n[WARN] ${new Date().toISOString()} - Default ${credType} set to: ${credValue}`;
        }
        break;
        
      default:
        content += `\n\n${credType}: ${credValue}`;
    }
    
    // Update the file content
    fileObj.content = content;
    return true;
  },
  
  // Method to scan files for credentials
  scanFilesForCredentials() {
    console.log("Scanning files for credentials...");
    const allFilePaths = this.getAllFilePaths('/home/user');
    let foundUsername = null;
    let foundPassword = null;

    // Scan each file for credentials
    for (const filePath of allFilePaths) {
      const fileName = filePath.split('/').pop();
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
      
      // Get the directory containing the file
      const dirContents = this.getDirectoryContents(dirPath);
      if (!dirContents) continue;
      
      // Get the file
      const fileObj = dirContents[fileName];
      if (!fileObj || fileObj.type !== 'file') continue;
      
      // Search for username and password in the content
      const content = fileObj.content;
      
      // Look for username pattern
      const usernameMatch = content.match(/username.*?:\s*(\w+)/i) || 
                           content.match(/User created:\s*(\w+)/i) ||
                           content.match(/System username:\s*(\w+)/i) ||
                           content.match(/\/\/.*username.*?:\s*(\w+)/i);
      
      // Look for password pattern
      const passwordMatch = content.match(/password.*?:\s*(\w+)/i) || 
                           content.match(/Default password set to:\s*(\w+)/i) ||
                           content.match(/Secure password:\s*(\w+)/i) ||
                           content.match(/\/\/.*password.*?:\s*(\w+)/i);
      
      if (usernameMatch && !foundUsername) {
        foundUsername = usernameMatch[1];
        console.log(`Found username ${foundUsername} in ${filePath}`);
      }
      
      if (passwordMatch && !foundPassword) {
        foundPassword = passwordMatch[1];
        console.log(`Found password ${foundPassword} in ${filePath}`);
      }
      
      // If we found both, we can stop scanning
      if (foundUsername && foundPassword) break;
    }
    
    // Update credentials if found
    if (foundUsername) this.credentials.username = foundUsername;
    if (foundPassword) this.credentials.password = foundPassword;
    
    return {
      username: this.credentials.username,
      password: this.credentials.password
    };
  },

  // Debug method to verify credentials placement
  verifyCredentialsPlacement() {
    console.log("Verifying credentials placement...");
    // First check what we have in the credentials object
    console.log("Current credentials:", this.credentials);
    
    // Now scan files to see if we can find them
    const foundCreds = this.scanFilesForCredentials();
    console.log("Found credentials from scan:", foundCreds);
    
    // Compare them
    const credentialsMatch = this.credentials.username === foundCreds.username && 
                            this.credentials.password === foundCreds.password;
    console.log("Credentials match:", credentialsMatch);
    
    return credentialsMatch;
  },
};
// --- FILE SYSTEM REFACTOR END ---

// Command history for game terminal
let gameCommandHistory = [];
let gameCommandHistoryIndex = -1;

// Process file system commands in the game terminal
function processFileSystemCommand(cmd) {
  console.log(`Processing file system command: ${cmd}`);
  const parts = cmd.trim().split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  let terminalContent = '';
  // Make sure the file system is initialized
  if (!fileSystem.structure['/home/user'] || Object.keys(fileSystem.structure['/home/user'].children).length === 0) {
    console.log("File system not initialized, initializing now...");
    fileSystem.generateFileSystem();
  } else {
    // Check if main directories are properly populated
    const mainDirs = ['desktop', 'documents', 'pictures', 'music', 'videos'];
    let needsRepair = false;
    mainDirs.forEach(dir => {
      if (!fileSystem.structure['/home/user'].children[dir] || 
          !fileSystem.structure['/home/user'].children[dir].children ||
          Object.keys(fileSystem.structure['/home/user'].children[dir].children).length === 0) {
        needsRepair = true;
      }
    });
    if (needsRepair) {
      console.log("File system needs repair, regenerating...");
      fileSystem.generateFileSystem();
    }
  }
  
  switch (command) {
    case 'ls':
      // Get the contents of the current directory or specified directory
      const targetPath = args.length > 0 ? 
        (args[0].startsWith('/') ? args[0] : `${fileSystem.currentPath}/${args[0]}`) : 
        fileSystem.currentPath;
      
      console.log(`Running ls command on path: ${targetPath}`);
      
      const dirContents = fileSystem.getDirectoryContents(targetPath);
      console.log(`Directory contents:`, dirContents);
      
      if (!dirContents) {
        terminalContent = `ls: cannot access '${targetPath}': No such file or directory\n`;
      } else {
        // Format the directory contents
        const items = Object.keys(dirContents).sort();
        console.log(`Items in directory:`, items);
        
        if (items.length === 0) {
          terminalContent = 'Directory is empty';
        } else {
          let output = '';
          
          for (const item of items) {
            const isDir = dirContents[item].type === 'directory';
            output += isDir ? 
              `<span class="directory">${item}/</span>  ` : 
              `<span class="file">${item}</span>  `;
          }
          
          terminalContent = output;
        }
      }
      break;
      
    case 'cd':
      if (args.length === 0 || args[0] === '~') {
        // cd with no args or ~ goes to home directory
        fileSystem.currentPath = '/home/user';
        terminalContent = '';
      } else {
        const path = args[0];
        
        // Handle special case '..'
        if (path === '..') {
          // Go up one directory
          const pathParts = fileSystem.currentPath.split('/').filter(p => p);
          if (pathParts.length > 2) { // Don't go above /home/user
            pathParts.pop();
            fileSystem.currentPath = '/' + pathParts.join('/');
          } else {
            fileSystem.currentPath = '/home/user';
          }
          terminalContent = '';
        } else if (path === '.') {
          // Stay in current directory
          terminalContent = '';
        } else {
          // Try to change to the specified directory
          let targetPath = path.startsWith('/') ? path : `${fileSystem.currentPath}/${path}`;
          
          // Normalize the path (handle things like /home/user/../etc)
          const parts = targetPath.split('/').filter(p => p);
          const normalized = [];
          for (const part of parts) {
            if (part === '..') {
              normalized.pop();
            } else if (part !== '.') {
              normalized.push(part);
            }
          }
          targetPath = '/' + normalized.join('/');
          
          // Make sure we don't go above /home/user
          if (!targetPath.startsWith('/home/user')) {
            targetPath = '/home/user';
          }
          
          // Check if the directory exists
          const dirContents = fileSystem.getDirectoryContents(targetPath);
          if (dirContents) {
            fileSystem.currentPath = targetPath;
            terminalContent = '';
          } else {
            terminalContent = `cd: ${args[0]}: No such file or directory\n`;
          }
        }
      }
      break;
      
    case 'pwd':
      terminalContent = fileSystem.currentPath;
      break;
      
    case 'cat':
      if (args.length === 0) {
        terminalContent = 'Usage: cat [file]\n';
      } else {
        const fileName = args[0];
        const dirPath = fileSystem.currentPath;
        
        // Check if it's a relative or absolute path
        let targetPath, targetFileName;
        if (fileName.includes('/')) {
          // It's a path
          const lastSlash = fileName.lastIndexOf('/');
          targetPath = fileName.startsWith('/') ? fileName.substring(0, lastSlash) : `${dirPath}/${fileName.substring(0, lastSlash)}`;
          targetFileName = fileName.substring(lastSlash + 1);
        } else {
          // It's just a filename in the current directory
          targetPath = dirPath;
          targetFileName = fileName;
        }
        
        // Get the directory
        const dirContents = fileSystem.getDirectoryContents(targetPath);
        if (!dirContents) {
          terminalContent = `cat: ${fileName}: No such file or directory\n`;
        } else if (!dirContents[targetFileName]) {
          terminalContent = `cat: ${fileName}: No such file or directory\n`;
        } else if (dirContents[targetFileName].type === 'directory') {
          terminalContent = `cat: ${fileName}: Is a directory\n`;
        } else {
          // Display the file content
          terminalContent = dirContents[targetFileName].content.replace(/\n/g, '<br>');
        }
      }
      break;
      
    case 'help':
      if (args.length === 0) {
        terminalContent = `Available commands:
ls - List directory contents
cd - Change directory
pwd - Print working directory
cat - Display file contents
help - Show this help message
clear - Clear the terminal
exit - Return to main terminal
hint - Get a hint about finding credentials

Type 'help [command]' for more information about a specific command.`;
      } else {
        // Help for specific command
        switch (args[0]) {
          case 'ls':
            terminalContent = 'ls - List directory contents\n\nUsage: ls [directory]\n\nIf no directory is specified, lists the contents of the current directory.';
            break;
          case 'cd':
            terminalContent = 'cd - Change directory\n\nUsage: cd [directory]\n\nChange the current working directory to the specified directory.\nIf no directory is specified, change to the home directory (/home/user).\nUse "cd .." to go up one directory.';
            break;
          case 'pwd':
            terminalContent = 'pwd - Print working directory\n\nUsage: pwd\n\nPrints the absolute path of the current working directory.';
            break;
          case 'cat':
            terminalContent = 'cat - Display file contents\n\nUsage: cat [file]\n\nDisplay the contents of the specified file.';
            break;

          default:
            terminalContent = `No help available for '${args[0]}'.`;
        }
      }
      break;
      
    case 'hint':
      if (args.length === 0) {
        terminalContent = "Available hints: credentials, navigation, commands\n";
        terminalContent += "Type 'hint [topic]' for more information\n";
      } else if (args[0] === 'credentials') {
        terminalContent = "HINT: Credentials are hidden in random files throughout the system.\n";
        terminalContent += "You need to find both username and password to log in.\n";
        terminalContent += "Try using 'cd' to navigate directories and 'ls' to list contents.\n";
        terminalContent += "Use 'cat' to view file contents where credentials might be hidden.\n";
        terminalContent += "Look for patterns like 'username:', 'password:', or system messages.\n";
      } else if (args[0] === 'navigation') {
        terminalContent = "HINT: Use 'cd [directory]' to navigate between directories.\n";
        terminalContent += "Use 'cd ..' to go up one level.\n";
        terminalContent += "Use 'pwd' to see your current location.\n";
        terminalContent += "Use 'ls' to list files and directories in your current location.\n";
      } else if (args[0] === 'commands') {
        terminalContent = "Available commands: ls, cd, pwd, cat, hint, help, clear, login\n";
        terminalContent += "Type 'help [command]' for more information about a specific command.\n";
      } else {
        terminalContent = `No hint available for '${args[0]}'. Try 'hint' for a list of hint topics.\n`;
      }
      break;
      
    default:
      // If we get here, it's not a file system command
      return false;
  }
  
  // If we got here, we handled a file system command
  if (terminalContent) {
    gameTerminalContent.innerHTML += `<div class="system-message">${terminalContent}</div>`;
  }
  return true;
}

// Game Matrix Rain Animation
function initGameMatrixRain() {
  const gameMatrixCanvas = document.getElementById('game-matrix-canvas');
  const gameMatrixCtx = gameMatrixCanvas.getContext('2d');
  const gameMatrixDrops = [];
  
  // Set canvas dimensions
  gameMatrixCanvas.width = window.innerWidth;
  gameMatrixCanvas.height = window.innerHeight;
  
  const gameColumns = Math.floor(gameMatrixCanvas.width / fontSize);
  
  // Initialize drops
  for (let i = 0; i < gameColumns; i++) {
    gameMatrixDrops[i] = Math.floor(Math.random() * -100); 
  }
  
  function drawGameMatrixRain() {
    gameMatrixCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    gameMatrixCtx.fillRect(0, 0, gameMatrixCanvas.width, gameMatrixCanvas.height);
    
    gameMatrixCtx.fillStyle = '#8EFF9F';
    gameMatrixCtx.font = `${fontSize}px JetBrains Mono`;
    
    for (let i = 0; i < gameMatrixDrops.length; i++) {
      if (gameMatrixDrops[i] > 0) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        if (gameMatrixDrops[i] * fontSize < fontSize * 2) {
          gameMatrixCtx.fillStyle = '#FFFFFF';
          gameMatrixCtx.fillText(text, i * fontSize, gameMatrixDrops[i] * fontSize);
          gameMatrixCtx.fillStyle = '#8EFF9F'; 
        } else {
          gameMatrixCtx.fillText(text, i * fontSize, gameMatrixDrops[i] * fontSize);
        }
      }
      if (Math.random() > 0.3) {
        gameMatrixDrops[i]++;
      }
      
      if (gameMatrixDrops[i] === 0 && Math.random() > 0.975) {
        gameMatrixDrops[i] = 1;
      }
      
      if (gameMatrixDrops[i] * fontSize > gameMatrixCanvas.height) {
        gameMatrixDrops[i] = 0;
      }
    }
    
    requestAnimationFrame(drawGameMatrixRain);
  }
  
  // Start the animation
  drawGameMatrixRain();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    gameMatrixCanvas.width = window.innerWidth;
    gameMatrixCanvas.height = window.innerHeight;
    
    const newColumns = Math.floor(gameMatrixCanvas.width / fontSize);
    
    // Adjust drops array if needed
    if (newColumns > gameMatrixDrops.length) {
      for (let i = gameMatrixDrops.length; i < newColumns; i++) {
        gameMatrixDrops[i] = 0;
      }
    }
  });
}

// Ensure all canvases resize properly when window size changes
window.addEventListener('resize', function() {
  // Main matrix rain
  resizeCanvas();
  
  // Game loading matrix rain
  if (document.getElementById('game-matrix-canvas')) {
    const gameMatrixCanvas = document.getElementById('game-matrix-canvas');
    gameMatrixCanvas.width = window.innerWidth;
    gameMatrixCanvas.height = window.innerHeight;
  }
  
  // Login matrix rain
  if (document.getElementById('login-matrix-canvas')) {
    const loginMatrixCanvas = document.getElementById('login-matrix-canvas');
    loginMatrixCanvas.width = loginMatrixCanvas.parentElement.offsetWidth;
    loginMatrixCanvas.height = loginMatrixCanvas.parentElement.offsetHeight;
  }
});






// Add command history navigation to game terminal input
if (gameInput) {
  gameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const value = gameInput.value.trim();
      if (!value) return;
      // Add to history
      gameCommandHistory.push(value);
      gameCommandHistoryIndex = gameCommandHistory.length;
      processGameCommand(value);
      gameInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (gameCommandHistory.length === 0) return;
      if (gameCommandHistoryIndex > 0) {
        gameCommandHistoryIndex--;
        gameInput.value = gameCommandHistory[gameCommandHistoryIndex];
      } else if (gameCommandHistoryIndex === 0) {
        gameInput.value = gameCommandHistory[0];
      }
      setTimeout(() => gameInput.setSelectionRange(gameInput.value.length, gameInput.value.length), 0);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (gameCommandHistory.length === 0) return;
      if (gameCommandHistoryIndex < gameCommandHistory.length - 1) {
        gameCommandHistoryIndex++;
        gameInput.value = gameCommandHistory[gameCommandHistoryIndex];
      } else if (gameCommandHistoryIndex === gameCommandHistory.length - 1) {
        gameCommandHistoryIndex++;
        gameInput.value = '';
      }
      setTimeout(() => gameInput.setSelectionRange(gameInput.value.length, gameInput.value.length), 0);
      e.preventDefault();
    } else if (e.key === 'Tab') {
      // --- AUTOCOMPLETE START ---
      e.preventDefault();
      const inputValue = gameInput.value;
      const cursorPos = gameInput.selectionStart;
      // Split input into command and last word
      const beforeCursor = inputValue.slice(0, cursorPos);
      const afterCursor = inputValue.slice(cursorPos);
      const match = beforeCursor.match(/^(.*?)([\w\-\.\/]+)$/);
      if (!match) return;
      const cmdPart = match[1];
      const lastWord = match[2];
      // Determine autocomplete context (for cd/cat/ls, use current dir)
      let dirContents = fileSystem.getDirectoryContents(fileSystem.currentPath);
      if (!dirContents) return;
      const items = Object.keys(dirContents);
      // Only suggest items that start with lastWord
      const matches = items.filter(name => name.startsWith(lastWord));
      if (matches.length === 0) return;
      // If only one match, autocomplete fully
      let completion = '';
      if (matches.length === 1) {
        completion = matches[0];
      } else {
        // Find longest common prefix
        let prefix = matches[0];
        for (let i = 1; i < matches.length; i++) {
          let j = 0;
          while (j < prefix.length && j < matches[i].length && prefix[j] === matches[i][j]) j++;
          prefix = prefix.slice(0, j);
        }
        completion = prefix;
      }
      // Replace lastWord with completion
      gameInput.value = cmdPart + completion + afterCursor;
      // Move cursor to end of completion
      const newPos = (cmdPart + completion).length;
      setTimeout(() => gameInput.setSelectionRange(newPos, newPos), 0);
      // Optionally, show all matches if more than one
      if (matches.length > 1) {
        gameTerminalContent.innerHTML += `<div class="system-message">${matches.map(m => `<span>${m}</span>`).join('  ')}</div>`;
        scrollGameTerminal();
      }
      // --- AUTOCOMPLETE END ---
    }
  });
}
