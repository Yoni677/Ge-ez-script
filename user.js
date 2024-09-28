// Dictionary for Geez to JavaScript translations
const translationDictionary = {
    'ፕሪንት': 'document.write', // Translate print to console.log
    'ፈጽሞ': 'let',           // Translate variable declaration to let
    // Add more translations here
};

// Function to compile Geez Script to JavaScript
function compileGeezScriptToJavaScript(geezCode) {
    let jsCode = geezCode;

    // Iterate over the dictionary and replace each Geez keyword with its JavaScript equivalent
    for (const [geezKeyword, jsEquivalent] of Object.entries(translationDictionary)) {
        const regex = new RegExp(geezKeyword, 'g'); // Create a regex for global replacement
        jsCode = jsCode.replace(regex, jsEquivalent);
        jsCode = jsCode.replace(/##.*$/gm, '').replace(/\$[\s\S]*\$/g, '');
    }

    return jsCode;
}

// Find all script tags with type "text/gpl"
document.querySelectorAll('script[type="gs"]').forEach(script => {
    // Extract the Geez Script code
    const geezScriptCode = script.textContent;

    try {
        // Compile the Geez Script to valid JavaScript
        const compiledJavaScript = compileGeezScriptToJavaScript(geezScriptCode);

        // Execute the compiled JavaScript
        eval(compiledJavaScript);  
    } catch (e) {
        console.error("Error compiling Geez Script: ", e.message);
    }
});

