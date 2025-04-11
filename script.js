const multiWordKeywords = {
    // የነበሩት
    "አትም": "console.log",
    "ቢሆን": "if",
    "ኤልስ": "else",
    "ተለዋዋጭ": "var",
    "ቋሚ": "const",
    "ይሁን": "let",
    "ከሆነ": "if",
    "ካልሆነ": "else",
    "ከልሆነ": "else if",
    "×": "*",
    "ሞክር": "try",
    "ያዝ": "catch",
    "እውነት": "true",
    "ህሰት": "false",
    "አይነት": "typeof",
    "መልስ": "return",
    "አዲስ": "new",
    "አስገባ": "import",
    "ወስጥ": "in",
    "ለ": "for",
    "አውጣጣ": "export",
    "መደበኛ": "default",
    "ቀጥል": "continue",
    "እሀ": "boolean",
    "ጠብቅ": "await",
    "አድርግ": "do",
    "÷": "/",
    

    // አዲስ ቁልፍ ቃላት
    "ተግባር": "function",
    "መደብ": "class",
    "ገንቢ": "constructor",
    "ወራሽ": "extends",
    "ይህ": "this",
    "ባዶ": "null",
    "የለም": "undefined",
    "ሰርዝ": "delete",
    "ስብስብ": "array",
    "ዝርዝር": "list",
    "ወደ": "switch",
    "ሁኔታ": "case",
    "ሰብር": "break",
    "በቀጣይ": "next",
    "ሁለንተናዊ": "global",
    "የግል": "private",
    "የህዝብ": "public",
    "የተጠበቀ": "protected",
    "ቅንጅት": "interface",
    "ትግበራ": "implements",
    "ባህሪ": "property",
    "ማስተላለፊያ": "parameter",
    "ውጤት": "result",
    "መልስ": "return",
    "እስከ": "while",
    "መጨረሻ": "finally",
    "ወይም": "||",
    "እና": "&&",
    "እኩል": "===",
    "አይደለም": "!==",
    "የለም": "!",
    "ቅደም": "async",
    "ጠብቅ": "await",
    "ስሪት": "module",
    "ወደ_ቁጥር": "parseInt",
    "ወደ_ጽሁፍ": "toString",
    "ወደ_እሀ": "toBoolean",
    "ርዝመት": "length",
    "ጨምር": "push",
    "አውጣ": "pop",
    "ቅዳ": "map",
    "አጣራ": "filter",
    "ቀንስ": "reduce",
    "ገባ": "includes",
    "ተቀላቅል": "join",
    "ክፈል": "split",
    "ቆራርጥ": "slice",
    "ተካ": "replace",
    "እዘዝ": "alert",
    "ጠይቅ": "prompt",
};

const singleWordKeywords = ["ፔር"];

// Map for Geez numerals to Arabic numbers
const geezNumberMap = {
    "፩": 1, "፪": 2, "፫": 3, "፬": 4, "፭": 5,
    "፮": 6, "፯": 7, "፰": 8, "፱": 9, "፲": 10,
    "፳": 20, "፴": 30, "፵": 40, "፶": 50,
    "፷": 60, "፸": 70, "፹": 80, "፺": 90,
    "፻": 100, "፲፻": 1000, "፼": 10000
};

// Reverse mapping for Arabic numbers to Geez numerals
const arabicToGeezMap = Object.fromEntries(
    Object.entries(geezNumberMap).map(([geez, arabic]) => [arabic, geez])
);

// Function to convert Geez numbers to Arabic numbers
function convertGeezToArabic(geezNumberStr) {
    let arabicNumber = 0;
    let currentMultiplier = 1;

    // Reverse the string to process smaller values first
    for (let i = geezNumberStr.length - 1; i >= 0; i--) {
        const geezChar = geezNumberStr[i];
        if (geezNumberMap[geezChar] !== undefined) {
            arabicNumber += geezNumberMap[geezChar] * currentMultiplier;
        } else if (geezChar === "፻") {
            currentMultiplier = 100;
        } else if (geezChar === "፲") {
            currentMultiplier = 10;
        }
    
    }
    return arabicNumber;
}

// Function to convert Arabic numbers back to Geez numerals
function convertArabicToGeez(arabicNumber) {
    let geezNumber = '';
    const numerals = Object.keys(geezNumberMap).reverse();

    for (let numeral of numerals) {
        const value = geezNumberMap[numeral];
        while (arabicNumber >= value) {
            geezNumber += numeral;
            arabicNumber -= value;
        }
    }
    return geezNumber;
}

// Function to handle Geez number addition and return both Geez and Arabic
function handleGeezMath(expression) {
    // Replace Geez numbers in the expression with their Arabic equivalents
    const arabicExpression = expression.replace(/[፩-፻]+/g, function(match) {
        return convertGeezToArabic(match);
    });

    // Evaluate the Arabic number expression
    const result = eval(arabicExpression);

    // Convert the result back to Geez
    const geezResult = convertArabicToGeez(result);

    return {
        arabic: result,
        geez: geezResult
    };
}

// Example usage
const geezExpression = "፩ + ፩"; // "1 + 1" in Geez numerals
const result = handleGeezMath(geezExpression);
console.log(`Arabic Result: ${result.arabic}`); // Output: 2
console.log(`Geez Result: ${result.geez}`);     // Output: ፪


// Function to highlight keywords in the textarea
function highlightKeywords() {
    const inputField = document.getElementById("input");
    const inputText = inputField.value;

    // Highlight multi-word keywords
    let highlightedText = inputText.replace(/(\n|\r\n)/g, '<br/>');
    
    for (const keyword of Object.keys(multiWordKeywords)) {
        const regex = new RegExp(`(${keyword})`, 'g');
        highlightedText = highlightedText.replace(regex, `<span class="keyword">${keyword}</span>`);
    }

    // Highlight single-word keywords
    for (const keyword of singleWordKeywords) {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        highlightedText = highlightedText.replace(regex, `<span class="keyword">${keyword}</span>`);
    }

    // Display highlighted text
    inputField.innerHTML = highlightedText.replace(/\n/g, '<br/>');
}

function clearCode() {
    // Clear the input textarea
    document.getElementById('input').value = '';
    // Clear the output
    document.getElementById('output').textContent = '';
    // Clear the compiled code
    document.getElementById('compiledCode').textContent = '';
    // Clear any messages
    document.getElementById('message').textContent = '';
    // Update line numbers
    updateLineNumbers();
}

function toggleCompiledCode() {
    const compiledCode = document.getElementById("compiledCode");
    compiledCode.style.display = compiledCode.style.display === "none" ? "block" : "none";
}

function compileCode() {
    const input = document.getElementById("input").value.trim();
    const messageEl = document.getElementById("message");
    
    if (!input) {
        messageEl.textContent = "እባክዎ ኮድ ያስገቡ።";
        messageEl.className = "status-message error";
        return;
    }

    try {
        const jsCode = translateToJavaScript(input);
        document.getElementById("compiledCode").textContent = jsCode;

        const result = (function() {
            const output = [];
            
            const originalLog = console.log;
            console.log = function(message) {
                output.push(message);
                originalLog.apply(console, arguments);
            };
            try {
                new Function('አትም', jsCode)(console.log);
                messageEl.textContent = "ኮድ በተሳካ ሁኔታ ተተረጎመ!";
                messageEl.className = "status-message";
            }
          catch (e) {
                output.push("ስህተት: ${e.message}");
                messageEl.textContent = "የኮድ ስህተት!";
                messageEl.className = "status-message error";
            }
            
            console.log = originalLog;
            return output.join('\n');
        })();
        
        document.getElementById("output").textContent = result || "ምንም ውጤት የለም።";
        document.getElementById("compiledCode").style.display = "block";
        
    } catch (error) {
        document.getElementById("output").textContent = `ስህተት: ${error.message}`;
        messageEl.textContent = "ኮድ ማስኬድ አልተሳካም!";
        messageEl.className = "status-message error";
    }
}

function translateToJavaScript(amharicCode) {
    let jsCode = amharicCode;

    // First convert Geez numbers to Arabic
    jsCode = jsCode.replace(/[፩-፻]+/g, function(match) {
        return convertGeezToArabic(match);
    });

    // First pass: Extract strings and replace with placeholders
    const strings = [];
    let stringPlaceholder = 0;
    jsCode = jsCode.replace(/"([^"]*)"/g, (match, content) => {
        const placeholder = `__STR${stringPlaceholder++}__`;
        strings.push(match);
        return placeholder;
    });

    // Split code into tokens while preserving placeholders and dot notation
    const tokens = jsCode.split(/(?=\s+|[(){}\[\],;\.])|(?<=\s+|[(){}\[\],;\.])/g).filter(token => token.length > 0);

    // Handle dot notation for method calls and convert numeric literals
    let isClassName = false;
    let isMethodName = false;
    
    for (let i = 0; i < tokens.length - 1; i++) {
        const token = tokens[i].trim();
        const nextToken = tokens[i + 1] ? tokens[i + 1].trim() : '';
        
        // Mark class names
        if (token === 'መደብ' && /^[\u1200-\u137F_]+$/.test(nextToken)) {
            isClassName = true;
            continue;
        }
        
        // Mark method names
        if (token === 'ተግባር' && /^[\u1200-\u137F_]+$/.test(nextToken)) {
            isMethodName = true;
            tokens[i] = ''; // Remove 'ተግባር'
            continue;
        }
        
        // Reset flags after relevant tokens
        if (token === '{' || token === '(') {
            isClassName = false;
            isMethodName = false;
        }
        
        // Handle dot notation
        if (token === '.' && /^[\u1200-\u137F_]+$/.test(nextToken)) {
            tokens[i] = '.' + nextToken;
            tokens.splice(i + 1, 1);
            i--;
            continue;
        }
        
        // Convert numeric literals
        if (/^\d+$/.test(token)) {
            tokens[i] = convertArabicToGeez(parseInt(token));
        }
    }

    // Second pass: Identify variable declarations and create mappings
    const identifierMap = new Map();
    let varCounter = 1;
    let isDeclaration = false;
    let currentVar = '';

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token === 'ይሁን' || token === 'ቋሚ') {
            isDeclaration = true;
            continue;
        }
        const nextToken = tokens[i + 1] ? tokens[i + 1].trim() : '';
        // Don't convert variable names after class or new keywords
        if (token === 'መደብ' || token === 'አዲስ') {
            continue;
        }
        if (isDeclaration && /^[\u1200-\u137F]+$/.test(token) && !multiWordKeywords[token]) {
            currentVar = token;
            identifierMap.set(token, token); // Keep original name
            isDeclaration = false;
        }
    }

    // Third pass: Process all tokens with complete identifier map
    let skipTokens = 0;
    const processedTokens = tokens.map((token, idx) => {
        if (skipTokens > 0) {
            skipTokens--;
            return '';
        }
        
        // Skip whitespace
        if (/^\s+$/.test(token)) {
            return token;
        }

        // Restore string placeholders
        if (token.startsWith('__STR') && token.endsWith('__')) {
            const index = parseInt(token.slice(5, -2));
            return strings[index];
        }

        // Handle variable declarations and operators
        if (token === 'ይሁን') return 'let';
        if (token === 'ቋሚ') return 'const';
        if (token === '×') return '*';
        if (token === '>') return '>';
        if (token === '+') return '+';
        if (token === ',') return ',';
        if (token === '=') return '=';
        if (token === '=>') return '=>';
        if (token === '(') return '(';
        if (token === ')') return ')';
        if (token === '[') return '[';
        if (token === ']') return ']';
        if (token === '{') return '{';
        if (token === '}') return '}';
        
        // Handle class-related keywords
        if (token === 'መደብ') return 'class';
        if (token === 'ወራሽ') return 'extends';
        if (token === 'ገንቢ') return 'constructor';
        if (token === 'ተግባር') return '';
        if (token === 'ይህ') return 'this';
        // Handle super call with parameters
        if (token === 'ባዶ') {
            // Look ahead for parameters
            let j = idx + 1;
            // Skip whitespace
            while (j < tokens.length && /\s/.test(tokens[j])) j++;
            
            // Check if we have parameters
            if (j < tokens.length && /^[\u1200-\u137F_]+$/.test(tokens[j])) {
                // Found a parameter
                skipTokens = j - idx;
                return `super(${tokens[j]});`;
            }
            return 'super();';
        }
        if (token === 'አዲስ') return 'new';
        
        // Skip variable name generation for class and method names
        if (isClassName || isMethodName) {
            return token;
        }
        
        // Handle array methods
        if (token.startsWith('.')) {
            // Handle dot notation for array methods
            if (token === '.ቅዳ') return '.map';
            if (token === '.አጣራ') return '.filter';
            if (token === '.ቀንስ') return '.reduce';
        } else {
            // Handle standalone method names
            if (token === 'ቅዳ') return 'map';
            if (token === 'አጣራ') return 'filter';
            if (token === 'ቀንስ') return 'reduce';
        }
       
        // Convert numbers if they are Geez numerals
        if (/^[፩-፻]+$/.test(token)) {
            return convertGeezToArabic(token).toString();
        }
       
        // Handle Amharic identifiers using the complete map
        if (/^[\u1200-\u137F]+$/.test(token)) {
            if (identifierMap.has(token)) {
                return identifierMap.get(token);
            }
            if (multiWordKeywords[token]) {
                return multiWordKeywords[token];
            }
        }

        return token;
    });

    // Rejoin the code
    jsCode = processedTokens.join('');

    // Handle special cases
    jsCode = jsCode.replace(/ከሆን\s+(\w+)\s*([><=!]+)\s*(\w+)\s*\{/g, "if ($1 $2 $3) {");
    jsCode = jsCode.replace(/ካልሆነ\s*\{/g, "else {");
    jsCode = jsCode.replace(/ከልሆነ\s+([^{]+)\s*\{/g, "else if ($1) {");
    jsCode = jsCode.replace(/ይሁን/g, "let");
    jsCode = jsCode.replace(/እዘዝ/g, "alert");
    jsCode = jsCode.replace(/አትም/g, "console.log");

    // Clean up
    jsCode = jsCode.replace(/##.*$/gm, '').replace(/\$[\s\S]*\$/g, '');
    jsCode = jsCode.replace(/;/g, "");
    jsCode = jsCode.replace(/!/g, "%");
    jsCode = jsCode.replace(/@@/g, "&&");
    jsCode = jsCode.replace(/__/g, "||");

    // Handle special cases before restoring strings
    jsCode = jsCode.replace(/ከሆን\s+(\w+)\s*([><=!]+)\s*(\w+)\s*\{/g, "if ($1 $2 $3) {");
    jsCode = jsCode.replace(/ካልሆነ\s*\{/g, "else {");
    jsCode = jsCode.replace(/ከልሆነ\s+([^{]+)\s*\{/g, "else if ($1) {");
    jsCode = jsCode.replace(/ይሁን/g, "let");
    jsCode = jsCode.replace(/እዘዝ/g, "alert");
    jsCode = jsCode.replace(/አትም/g, "console.log");

    // Clean up before restoring strings
    jsCode = jsCode.replace(/##.*$/gm, '').replace(/\$[\s\S]*\$/g, '');
    jsCode = jsCode.replace(/;/g, "");
    jsCode = jsCode.replace(/!/g, "%");
    jsCode = jsCode.replace(/@@/g, "&&");
    jsCode = jsCode.replace(/__/g, "||");

    // Restore string placeholders
    jsCode = jsCode.replace(/__STR(\d+)__/g, (_, index) => strings[parseInt(index)]);

    console.log("Translated code:", jsCode);
    console.log("Identifier map:", identifierMap);
    return jsCode;
}

// Add this new function
function downloadCode() {
    const input = document.getElementById("input").value.trim();
    
    if (!input) {
        const messageEl = document.getElementById("message");
        messageEl.textContent = "እባክዎ ኮድ ያስገቡ።";
        messageEl.className = "status-message error";
        return;
    }

    try {
        // First ask for filename
        let fileName = prompt("የፋይሉን ስም ያስገቡ:", "geezscript_code") || "geezscript_code";
        
        // Add .js extension if not present
        if (!fileName.endsWith('.js')) {
            fileName += '.js';
        }

        // Translate the code
        const jsCode = translateToJavaScript(input)
            // Replace አትም with console.log
           
            .replace(/ይሁን/g, 'let')
            .replace(/ከልሆነ/g, 'else if')
            // Add semicolons at the end of lines
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.endsWith(';') ? line : line + ';')
            .join('\n');
        
        // Create blob and download link
        const blob = new Blob([jsCode], { type: 'text/javascript' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Show success message
        const messageEl = document.getElementById("message");
        messageEl.textContent = "ኮድ በተሳካ ሁኔታ ተቀምጧል!";
        messageEl.className = "status-message";
    } catch (error) {
        const messageEl = document.getElementById("message");
        messageEl.textContent = "ኮድ ማውረድ አልተሳካም!";
        messageEl.className = "status-message error";
    }
}

function translateToGeezScript(jsCode) {
    // First pass: Extract strings and replace with placeholders
    const strings = [];
    let stringPlaceholder = 0;
    jsCode = jsCode.replace(/"([^"]*)"/g, (match, content) => {
        const placeholder = `__STR${stringPlaceholder++}__`;
        strings.push(match);
        return placeholder;
    });

    // Create reverse mappings
    const reverseKeywords = {};
    for (const [geez, js] of Object.entries(multiWordKeywords)) {
        reverseKeywords[js] = geez;
    }

    // Replace JavaScript keywords with Geez equivalents
    let geezCode = jsCode;
    
    // Handle special cases first
    geezCode = geezCode.replace(/console\.log\s*\(/g, 'አትም(');
    geezCode = geezCode.replace(/alert\s*\(/g, 'እዘዝ(');
    geezCode = geezCode.replace(/if\s*\(([^)]+)\)\s*\{/g, 'ከሆነ $1 {');
    geezCode = geezCode.replace(/else\s*\{/g, 'ካልሆነ {');
    geezCode = geezCode.replace(/else\s+if\s*\(([^)]+)\)\s*\{/g, 'ከልሆነ $1 {');

    // Remove comments that are translations
    geezCode = geezCode.replace(/\s*\/\/\s*Parent constructor.*$/gm, '');

    // Handle class-related keywords
    geezCode = geezCode.replace(/class\s+([^\s{]+)\s*\{/g, 'መደብ $1 {');
    geezCode = geezCode.replace(/extends\s+([^\s{]+)\s*\{/g, 'ወራሽ $1 {');
    geezCode = geezCode.replace(/constructor\s*\(/g, 'ገንቢ(');
    geezCode = geezCode.replace(/\bthis\b/g, 'ይህ');
    
    // Handle super calls with parameters
    geezCode = geezCode.replace(/super\s*\(([^)]*)\)\s*;/g, (match, params) => {
        return params.trim() ? `ባዶ ${params};` : 'ባዶ;';
    });
    
    geezCode = geezCode.replace(/\bnew\s+/g, 'አዲስ ');
    
    // Handle method declarations (excluding constructor)
    geezCode = geezCode.replace(/([^\s{]+)\s*\(([^)]*)\)\s*\{(?!\s*constructor)/g, 'ተግባር $1($2) {');

    // Handle array methods with dot notation
    geezCode = geezCode.replace(/\.map\s*\(/g, '.ቅዳ(');
    geezCode = geezCode.replace(/\.filter\s*\(/g, '.አጣራ(');
    geezCode = geezCode.replace(/\.reduce\s*\(/g, '.ቀንስ(');

    // Handle operators
    geezCode = geezCode.replace(/\*/g, '×');
    geezCode = geezCode.replace(/&&/g, 'እና');
    geezCode = geezCode.replace(/\|\|/g, 'ወይም');
    
    // Replace other keywords
    for (const [js, geez] of Object.entries(reverseKeywords)) {
        const regex = new RegExp(`\\b${js}\\b`, 'g');
        geezCode = geezCode.replace(regex, geez);
    }

    // Convert Arabic numbers to Geez numerals
    geezCode = geezCode.replace(/\b\d+\b/g, match => {
        return convertArabicToGeez(parseInt(match));
    });

    // Restore string placeholders
    geezCode = geezCode.replace(/__STR(\d+)__/g, (_, index) => strings[parseInt(index)]);

    return geezCode;
}

if (typeof window !== 'undefined') {
    // Browser environment
    window.translateToGeezScript = translateToGeezScript;
    window.clearCode = clearCode;
} else {
    // Node.js environment
    module.exports = {
        translateToJavaScript,
        translateToGeezScript,
        convertGeezToArabic,
        convertArabicToGeez,
        handleGeezMath
    };
}



 

