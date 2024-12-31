const multiWordKeywords = ["ኮንሶል.ሎግ", "ለት", "ኢፍ", "ኤልስ"];
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
    
    for (const keyword of multiWordKeywords) {
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

function compileCode() {
    const input = document.getElementById("input").value.trim();
    
    if (!input) {
        document.getElementById("message").textContent = "Please enter code to compile.";
        return;
    }

    const jsCode = translateToJavaScript(input);
    
    document.getElementById("compiledCode").textContent = jsCode;

    try {
        const result = (function() {
            const output = [];
            console.log = (message) => output.push(message);
            new Function(jsCode)(); // Execute the translated code
            return output.join('\n');
        })();
        
        document.getElementById("output").textContent = result || "No output.";
        document.getElementById("message").textContent = "Code compiled successfully!";
        
        // Show the JavaScript code container
        document.querySelector('.containerjs').style.display = 'block';
        
    } catch (error) {
        document.getElementById("output").textContent = `Error: ${error.message}`;
        document.getElementById("message").textContent = "Compilation failed!";
    }
}

// ... (rest of the code remains unchanged)

function translateToJavaScript(amharicCode) {
    const multiWordMap = {
        "ኮንሶል.ሎግ": "console.log",
        "ተለዋዋጭ": "var",
        "ቋሚ": "const",
        "ቢሆን": "let",
        "ከሆን": "if",
        "ካልሆነ": "else",
        "ከልሆነ": "else if",
        "×":"*",
        "ሞክር":"try",
        "ያዝ":"catch",
        "እውነት":"true",
        "ህሰት":"false",
        "አይነት":"typeof",
        "መልስ":"return",
        "አዲስ":"new",
        "አስገባ":"import",
        "ወስጥ":"in",
        "ለ":"for",
        "አውጣጣ":"export",
        "መደበኛ":"default",
        "ቀጥል":"continue",
        "እሀ":"boolean",
        "ጠብቅ":"await",
        "አድርግ":"do",
        "÷": "/",
       
        
    }

    let jsCode = amharicCode;

    // Replace Amharic keywords with JavaScript equivalents
    for (const key in multiWordMap) {
        const regex = new RegExp(key, 'g');
        jsCode = jsCode.replace(regex, multiWordMap[key]);
    }

    // Find and convert Geez numbers to Arabic
    jsCode = jsCode.replace(/[፩-፻]+/g, function(match) {
        return convertGeezToArabic(match);
    });

    // Handle variable declarations
    jsCode = jsCode.replace(/ለት\s+(\w+)\s*=\s*(.+)/g, "let $1 = $2");
      jsCode = jsCode.replace(/##.*$/gm, '').replace(/\$[\s\S]*\$/g, '')
    // Handle conditional statements
     // Remove semicolons
    jsCode = jsCode.replace(/;/g, "");
    jsCode = jsCode.replace(/\u1200\u1261\u1228\s+(\w+)\s*([><=!]+)\s*(\w+)\s*\{/g, "if ($1 $2 $3) {");
    jsCode = jsCode.replace(/\u1206\u1228\u1205\u1228\s*\{/g, "else {");
        jsCode = jsCode.replace(/if\s+(\w+)\s*([><=!]+)\s*(\w+)\s*\{/g, "if ($1 $2 $3) {");

    // Ensure valid JavaScript syntax for if conditions
  

 console.log(jsCode);
    
    return jsCode;
}



 
