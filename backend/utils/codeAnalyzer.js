export function detectLanguage(code) {
  const patterns = {
    javascript: [
      /\b(const|let|var|function|=>|async|await|require|module\.exports)\b/,
      /console\.log/,
      /\.(map|filter|reduce|forEach)\s*\(/,
      /import\s+.*\s+from\s+['"]/
    ],
    python: [
      /\b(def|class|import|from|if __name__|print)\b/,
      /:\s*$/m,
      /\bself\b/,
      /elif\b/
    ],
    java: [
      /\b(public|private|protected|class|void|static)\b/,
      /System\.out\.print/,
      /public\s+static\s+void\s+main/,
      /import\s+java\./
    ],
    c: [
      /\b(#include|int\s+main|printf|scanf|void\s+\w+\s*\()/,
      /#define\s+/,
      /\bstd::/,
      /malloc|calloc|free/
    ]
  };

  for (const [lang, langPatterns] of Object.entries(patterns)) {
    for (const pattern of langPatterns) {
      if (pattern.test(code)) {
        return lang;
      }
    }
  }

  return 'javascript';
}

export function analyzeCode(code) {
  const errors = [];
  const warnings = [];
  
  const hasSyntaxErrors = checkSyntaxErrors(code);
  if (hasSyntaxErrors) errors.push(...hasSyntaxErrors);
  
  const hasWarnings = checkWarnings(code);
  if (hasWarnings) warnings.push(...hasWarnings);
  
  const isCode = code.includes('{') || code.includes('}') || 
                 code.includes('def ') || code.includes('function') ||
                 code.includes('class ') || code.includes('import ');
  
  return {
    isCode,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 10) - (warnings.length * 5))
  };
}

function checkSyntaxErrors(code) {
  const errors = [];
  
  if (code.includes('{') && !code.includes('}')) {
    errors.push({ line: 'unknown', error: 'Missing closing brace', type: 'error' });
  }
  
  if (code.includes('}') && !code.includes('{')) {
    errors.push({ line: 'unknown', error: 'Missing opening brace', type: 'error' });
  }
  
  if (code.includes('(') && !code.includes(')')) {
    errors.push({ line: 'unknown', error: 'Missing closing parenthesis', type: 'error' });
  }
  
  if (/\bfor\s*\(\s*\)/.test(code)) {
    errors.push({ line: 'unknown', error: 'Empty for loop condition', type: 'error' });
  }
  
  if (/\bwhile\s*\(\s*true\s*\)/.test(code) || /\bwhile\s*\(\s*1\s*\)/.test(code)) {
    errors.push({ line: 'unknown', error: 'Potential infinite loop detected', type: 'error' });
  }
  
  if (/\bfunction\s+\w+\s*\([^)]*\)\s*\{[^}]*\{/.test(code)) {
    const lines = code.split('\n');
    let braceCount = 0;
    let i = 0;
    while (i < lines.length && braceCount < 2) {
      for (const char of lines[i]) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }
      i++;
    }
    if (braceCount !== 0) {
      errors.push({ line: i, error: 'Mismatched braces in function', type: 'error' });
    }
  }
  
  return errors;
}

function checkWarnings(code) {
  const warnings = [];
  
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    if (line.trim().length > 120) {
      warnings.push({ line: index + 1, warning: 'Line too long', type: 'warning' });
    }
    
    if (/^[^/]*[a-z][A-Z]/.test(line) && !line.includes('_')) {
      warnings.push({ line: index + 1, warning: 'Variable naming should use camelCase or snake_case', type: 'warning' });
    }
  });
  
  if (/\bvar\s+\w+/.test(code)) {
    warnings.push({ line: 'unknown', warning: 'Consider using const or let instead of var', type: 'warning' });
  }
  
  return warnings;
}

export function analyzeComplexity(code, language) {
  const lines = code.split('\n').length;
  let complexity = 'Low';
  
  if (lines > 100) complexity = 'High';
  else if (lines > 50) complexity = 'Medium';
  
  const cyclomaticIndicators = (code.match(/\bif\b/g) || []).length +
                               (code.match(/\bfor\b/g) || []).length +
                               (code.match(/\bwhile\b/g) || []).length +
                               (code.match(/\bcase\b/g) || []).length;
  
  if (cyclomaticIndicators > 20) complexity = 'Very High';
  else if (cyclomaticIndicators > 10) complexity = 'High';
  
  return complexity;
}

export function explainCode(code, language) {
  const lang = language || detectLanguage(code);
  
  let explanation = `## Code Explanation\n\n`;
  explanation += `**Detected Language:** ${lang.charAt(0).toUpperCase() + lang.slice(1)}\n\n`;
  
  const lines = code.split('\n');
  explanation += `**Lines of Code:** ${lines.length}\n\n`;
  
  explanation += `### What this code does:\n\n`;
  
  if (lang === 'javascript') {
    explanation += explainJavaScript(code);
  } else if (lang === 'python') {
    explanation += explainPython(code);
  } else if (lang === 'java') {
    explanation += explainJava(code);
  } else if (lang === 'c') {
    explanation += explainC(code);
  } else {
    explanation += explainGeneric(code);
  }
  
  const analysis = analyzeCode(code);
  if (analysis.warnings.length > 0) {
    explanation += `\n### Suggestions:\n`;
    analysis.warnings.forEach(w => {
      explanation += `- Line ${w.line}: ${w.warning}\n`;
    });
  }
  
  return explanation;
}

function explainJavaScript(code) {
  let explanation = '';
  
  if (code.includes('import')) {
    explanation += `- Imports modules or components from external files\n`;
  }
  
  if (code.includes('function') || code.includes('=>')) {
    explanation += `- Defines one or more functions for reusable logic\n`;
  }
  
  if (code.includes('const') || code.includes('let') || code.includes('var')) {
    explanation += `- Declares variables to store data\n`;
  }
  
  if (code.includes('if') || code.includes('else')) {
    explanation += `- Contains conditional logic for decision making\n`;
  }
  
  if (code.includes('for') || code.includes('while')) {
    explanation += `- Uses loops for iteration\n`;
  }
  
  if (code.includes('async') || code.includes('await')) {
    explanation += `- Handles asynchronous operations\n`;
  }
  
  if (code.includes('class')) {
    explanation += `- Uses object-oriented programming with classes\n`;
  }
  
  if (code.includes('console.log')) {
    explanation += `- Outputs information to the console for debugging\n`;
  }
  
  if (code.includes('try') || code.includes('catch')) {
    explanation += `- Implements error handling\n`;
  }
  
  if (!explanation) {
    explanation = '- Contains general JavaScript code';
  }
  
  return explanation;
}

function explainPython(code) {
  let explanation = '';
  
  if (code.includes('import') || code.includes('from')) {
    explanation += `- Imports modules and libraries\n`;
  }
  
  if (code.includes('def ')) {
    explanation += `- Defines functions for reusable operations\n`;
  }
  
  if (code.includes('class ')) {
    explanation += `- Uses object-oriented programming with classes\n`;
  }
  
  if (code.includes('if __name__')) {
    explanation += `- Contains a main execution block\n`;
  }
  
  if (code.includes('for ') || code.includes('while ')) {
    explanation += `- Uses loops for iteration\n`;
  }
  
  if (code.includes('print(')) {
    explanation += `- Outputs data to the console\n`;
  }
  
  if (code.includes('@')) {
    explanation += `- Uses decorators for function modification\n`;
  }
  
  if (!explanation) {
    explanation = '- Contains general Python code';
  }
  
  return explanation;
}

function explainJava(code) {
  let explanation = '';
  
  if (code.includes('public class')) {
    explanation += `- Defines a public class as the main component\n`;
  }
  
  if (code.includes('public static void main')) {
    explanation += `- Contains the program entry point\n`;
  }
  
  if (code.includes('System.out.print')) {
    explanation += `- Outputs data to the console\n`;
  }
  
  if (code.includes('private') || code.includes('public')) {
    explanation += `- Uses access modifiers for encapsulation\n`;
  }
  
  if (code.includes('extends') || code.includes('implements')) {
    explanation += `- Implements inheritance or interfaces\n`;
  }
  
  if (!explanation) {
    explanation = '- Contains general Java code';
  }
  
  return explanation;
}

function explainC(code) {
  let explanation = '';
  
  if (code.includes('#include')) {
    explanation += `- Includes header files for functionality\n`;
  }
  
  if (code.includes('int main(')) {
    explanation += `- Contains the program entry point\n`;
  }
  
  if (code.includes('printf')) {
    explanation += `- Prints formatted output\n`;
  }
  
  if (code.includes('malloc') || code.includes('calloc')) {
    explanation += `- Allocates memory dynamically\n`;
  }
  
  if (code.includes('free')) {
    explanation += `- Frees dynamically allocated memory\n`;
  }
  
  if (code.includes('struct')) {
    explanation += `- Defines custom data structures\n`;
  }
  
  if (!explanation) {
    explanation = '- Contains general C code';
  }
  
  return explanation;
}

function explainGeneric(code) {
  return '- Contains code that performs various operations\n- Review the structure and logic for specific functionality\n';
}

export function fixCodeErrors(code, language) {
  let fixedCode = code;
  const errors = [];
  const warnings = [];
  
  const analysis = analyzeCode(code);
  errors.push(...analysis.errors);
  warnings.push(...analysis.warnings);
  
  fixedCode = fixedCode.replace(/\t/g, '  ');
  
  fixedCode = fixedCode.replace(/\s+$/gm, '');
  
  fixedCode = fixedCode.replace(/(\w+)\s+\1\s*=/g, '$1 =');
  
  const lines = fixedCode.split('\n');
  const formattedLines = lines.map(line => {
    let formatted = line;
    
    if (formatted.includes('{') && !formatted.includes('{}')) {
      formatted = formatted.replace(/\{\s*$/, ' {');
    }
    
    if (formatted.includes('}') && !formatted.trim().startsWith('}')) {
      formatted = '  ' + formatted;
    }
    
    return formatted;
  });
  
  fixedCode = formattedLines.join('\n');
  
  if (errors.length === 0 && warnings.length === 0) {
    return {
      fixedCode: code,
      errors: [{ line: 'unknown', error: 'No errors found - code looks good!', type: 'success' }],
      warnings: []
    };
  }
  
  return {
    fixedCode,
    errors,
    warnings
  };
}

export function optimizeCode(code, language) {
  let optimizedCode = code;
  const improvements = [];
  const lang = language || detectLanguage(code);
  
  if (lang === 'javascript') {
    if (code.includes('var ')) {
      optimizedCode = optimizedCode.replace(/\bvar\s+/g, 'const ');
      improvements.push('Replaced var with const for better scoping');
    }
    
    if (code.includes('for (let i = 0; i < array.length; i++)')) {
      optimizedCode = optimizedCode.replace(
        /for\s*\(let\s+i\s*=\s*0;\s*i\s*<\s*(\w+)\.length;\s*i\+\+\)/g,
        'for (const item of $1)'
      );
      improvements.push('Consider using for...of for cleaner iteration');
    }
    
    if (code.includes('.forEach') && !code.includes('map') && !code.includes('filter')) {
      improvements.push('Consider using map/filter/reduce for data transformations');
    }
    
    if (code.includes('JSON.parse') && code.includes('JSON.stringify')) {
      improvements.push('For deep cloning, consider structuredClone() or lodash');
    }
    
    if (code.includes('document.getElementById') && !code.includes('querySelector')) {
      improvements.push('Consider using querySelector for more flexible selection');
    }
  }
  
  if (lang === 'python') {
    if (code.includes('range(len(')) {
      improvements.push('Consider using enumerate() for index and value iteration');
    }
    
    if (code.includes('list.append') && code.includes('for ')) {
      improvements.push('Use list comprehension for more efficient list building');
    }
    
    if (code.includes(' == True') || code.includes(' == False')) {
      optimizedCode = optimizedCode.replace(/ == True/g, '').replace(/ == False/g, ' not');
      improvements.push('Simplified boolean comparisons');
    }
    
    if (code.includes('import *')) {
      improvements.push('Avoid wildcard imports for better code clarity');
    }
  }
  
  if (lang === 'java') {
    if (code.includes('StringBuffer') && !code.includes('StringBuilder')) {
      improvements.push('Consider using StringBuilder for single-threaded string concatenation');
    }
    
    if (code.includes('synchronized')) {
      improvements.push('Review synchronized blocks for potential deadlocks');
    }
  }
  
  if (lang === 'c') {
    if (code.includes('malloc') && !code.includes('free')) {
      improvements.push('Memory allocated but not freed - potential memory leak');
    }
    
    if (code.includes('printf') && !code.includes('\\n')) {
      improvements.push('Consider adding newlines for better output formatting');
    }
  }
  
  const lines = optimizedCode.split('\n');
  if (lines.length > 200) {
    improvements.push('Consider breaking this into smaller functions for maintainability');
  }
  
  if (improvements.length === 0) {
    improvements.push('Code appears to be well optimized');
  }
  
  return {
    optimizedCode,
    improvements
  };
}

export function convertCode(code, from, to) {
  let convertedCode = '';
  let notes = '';
  
  if (from === to) {
    return { convertedCode: code, notes: 'Source and target languages are the same' };
  }
  
  if (from === 'javascript' && to === 'python') {
    convertedCode = convertJStoPython(code);
    notes = 'Converted from JavaScript to Python. Review variable types and async/await patterns.';
  } else if (from === 'javascript' && to === 'java') {
    convertedCode = convertJStoJava(code);
    notes = 'Converted from JavaScript to Java. Review class structure and type annotations.';
  } else if (from === 'javascript' && to === 'c') {
    convertedCode = convertJStoC(code);
    notes = 'Converted from JavaScript to C. Review memory management and type safety.';
  } else if (from === 'python' && to === 'javascript') {
    convertedCode = convertPythonToJS(code);
    notes = 'Converted from Python to JavaScript. Review indentation and scoping.';
  } else if (from === 'python' && to === 'java') {
    convertedCode = convertPythonToJava(code);
    notes = 'Converted from Python to Java. Review indentation and type system.';
  } else if (from === 'python' && to === 'c') {
    convertedCode = convertPythonToC(code);
    notes = 'Converted from Python to C. Review memory management and loops.';
  } else if (from === 'java' && to === 'javascript') {
    convertedCode = convertJavaToJS(code);
    notes = 'Converted from Java to JavaScript. Review type system and classes.';
  } else if (from === 'java' && to === 'python') {
    convertedCode = convertJavaToPython(code);
    notes = 'Converted from Java to Python. Review indentation and type system.';
  } else if (from === 'java' && to === 'c') {
    convertedCode = convertJavaToC(code);
    notes = 'Converted from Java to C. Review memory management and pointers.';
  } else if (from === 'c' && to === 'javascript') {
    convertedCode = convertCToJS(code);
    notes = 'Converted from C to JavaScript. Review memory management.';
  } else if (from === 'c' && to === 'python') {
    convertedCode = convertCToPython(code);
    notes = 'Converted from C to Python. Review memory management and loops.';
  } else if (from === 'c' && to === 'java') {
    convertedCode = convertCToJava(code);
    notes = 'Converted from C to Java. Review memory management and classes.';
  } else {
    convertedCode = `// Conversion from ${from} to ${to} not fully supported\n// Manual conversion may be required\n\n${code}`;
    notes = 'Limited automatic conversion available. Manual review recommended.';
  }
  
  return { convertedCode, notes };
}

function convertJStoPython(code) {
  let python = code;
  
  python = python.replace(/const\s+(\w+)\s*=/g, '$1 =');
  python = python.replace(/let\s+(\w+)\s*=/g, '$1 =');
  python = python.replace(/var\s+(\w+)\s*=/g, '$1 =');
  
  python = python.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'def $1($2):');
  python = python.replace(/(\w+)\s*=>\s*\{/g, 'def $1():');
  python = python.replace(/(\w+)\s*=>\s*/g, 'lambda ');
  
  python = python.replace(/console\.log\(/g, 'print(');
  
  python = python.replace(/if\s*\(([^)]+)\)\s*\{/g, 'if $1:');
  python = python.replace(/else\s*\{/g, 'else:');
  python = python.replace(/else\s+if\s*\(([^)]+)\)\s*\{/g, 'elif $1:');
  
  python = python.replace(/for\s*\(\s*const\s+(\w+)\s+of\s+(\w+)\s*\)/g, 'for $1 in $2');
  python = python.replace(/for\s*\(\s*let\s+(\w+)\s*=\s*0;\s*\1\s*<\s*(\w+);\s*\1\+\+\s*\)/g, 'for i in range($2)');
  
  python = python.replace(/\{([^}]*)\}/gs, (match, content) => {
    const lines = content.split('\n').map(line => '    ' + line).join('\n');
    return ':\n' + lines;
  });
  
  python = python.replace(/;\s*$/gm, '');
  
  return python;
}

function convertJStoJava(code) {
  let java = code;
  
  java = java.replace(/const\s+/g, 'final ');
  java = java.replace(/let\s+/g, '');
  
  java = java.replace(/function\s+(\w+)\s*\(([^)]*)\)/g, 'public static void $1($2)');
  
  java = java.replace(/console\.log\(/g, 'System.out.println(');
  
  java = java.replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {');
  java = java.replace(/else\s*\{/g, 'else {');
  
  java = java.replace(/for\s*\(\s*const\s+(\w+)\s+of\s+(\w+)\s*\)/g, 'for (Object $1 : $2)');
  
  if (!java.includes('public class')) {
    java = 'public class Main {\n    public static void main(String[] args) {\n' + 
           java.split('\n').map(l => '        ' + l).join('\n') + 
           '\n    }\n}';
  }
  
  return java;
}

function convertJStoC(code) {
  let c = code;
  
  c = c.replace(/const\s+/g, 'const ');
  c = c.replace(/let\s+/g, '');
  
  c = c.replace(/function\s+(\w+)\s*\(([^)]*)\)/g, 'void $1($2)');
  
  c = c.replace(/console\.log\(/g, 'printf(');
  
  c = c.replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {');
  
  c = c.replace(/for\s*\(\s*const\s+(\w+)\s+of\s+(\w+)\s*\)/g, '// Iterate over collection');
  c = c.replace(/for\s*\(\s*let\s+(\w+)\s*=\s*0;\s*\1\s*<\s*(\w+);\s*\1\+\+\s*\)/g, 'for (int $1 = 0; $1 < $2; $1++)');
  
  if (!c.includes('#include')) {
    c = '#include <stdio.h>\n\n' + c;
  }
  
  return c;
}

function convertPythonToJS(code) {
  let js = code;
  
  js = js.replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'function $1($2) {');
  js = js.replace(/class\s+(\w+)\s*:/g, 'class $1 {');
  
  js = js.replace(/print\(/g, 'console.log(');
  
  js = js.replace(/if\s+([^:]+):/g, 'if ($1) {');
  js = js.replace(/elif\s+([^:]+):/g, '} else if ($1) {');
  js = js.replace(/else:/g, '} else {');
  
  js = js.replace(/for\s+(\w+)\s+in\s+(\w+):/g, 'for (const $1 of $2) {');
  
  js = js.replace(/^    /gm, '  ');
  js = js.replace(/:$/gm, ' {');
  
  return js;
}

function convertPythonToJava(code) {
  let java = code;
  
  java = java.replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'public void $1($2) {');
  java = java.replace(/class\s+(\w+)\s*:/g, 'public class $1 {');
  
  java = java.replace(/print\(/g, 'System.out.println(');
  
  java = java.replace(/if\s+([^:]+):/g, 'if ($1) {');
  
  java = java.replace(/for\s+(\w+)\s+in\s+range\((\d+)\):/g, 'for (int $1 = 0; $1 < $2; $1++) {');
  
  if (!java.includes('public class')) {
    java = 'public class Main {\n    public static void main(String[] args) {\n' + 
           java.split('\n').map(l => '        ' + l).join('\n') + 
           '\n    }\n}';
  }
  
  return java;
}

function convertPythonToC(code) {
  let c = code;
  
  c = c.replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'void $1($2) {');
  
  c = c.replace(/print\(/g, 'printf(');
  
  c = c.replace(/if\s+([^:]+):/g, 'if ($1) {');
  
  c = c.replace(/for\s+(\w+)\s+in\s+range\((\d+)\):/g, 'for (int $1 = 0; $1 < $2; $1++) {');
  
  if (!c.includes('#include')) {
    c = '#include <stdio.h>\n\n' + c;
  }
  
  return c;
}

function convertJavaToJS(code) {
  let js = code;
  
  js = js.replace(/public\s+class\s+(\w+)/g, 'class $1');
  js = js.replace(/private\s+|protected\s+/g, '');
  
  js = js.replace(/public\s+static\s+void\s+(\w+)\s*\(([^)]*)\)/g, 'function $1($2)');
  
  js = js.replace(/System\.out\.println\(/g, 'console.log(');
  
  js = js.replace(/if\s*\(([^)]+)\)\s*\{/g, 'if ($1) {');
  
  js = js.replace(/for\s*\(([^)]+)\)\s*\{/g, 'for ($1) {');
  
  return js;
}

function convertJavaToPython(code) {
  let python = code;
  
  python = python.replace(/public\s+class\s+(\w+)/g, 'class $1:');
  python = python.replace(/private\s+|protected\s+/g, '');
  
  python = python.replace(/public\s+static\s+void\s+(\w+)\s*\(([^)]*)\)/g, 'def $1($2):');
  python = python.replace(/public\s+void\s+(\w+)\s*\(([^)]*)\)/g, 'def $1($2):');
  
  python = python.replace(/System\.out\.println\(/g, 'print(');
  
  python = python.replace(/if\s*\(([^)]+)\)\s*\{/g, 'if $1:');
  python = python.replace(/else\s*\{/g, 'else:');
  
  python = python.replace(/for\s*\(([^)]+)\)\s*\{/g, 'for $1:');
  
  return python;
}

function convertJavaToC(code) {
  let c = code;
  
  c = c.replace(/public\s+class\s+(\w+)/g, '// class $1');
  c = c.replace(/private\s+|protected\s+/g, '');
  
  c = c.replace(/public\s+static\s+void\s+(\w+)\s*\(([^)]*)\)/g, 'void $1($2)');
  
  c = c.replace(/System\.out\.println\(/g, 'printf(');
  
  c = c.replace(/new\s+/g, '');
  
  return c;
}

function convertCToJS(code) {
  let js = code;
  
  js = js.replace(/#include\s*<\w+\.h>/g, '');
  
  js = js.replace(/int\s+main\s*\(([^)]*)\)\s*\{/g, 'function main($1) {');
  
  js = js.replace(/printf\(/g, 'console.log(');
  js = js.replace(/scanf\(/g, 'prompt(');
  
  js = js.replace(/int\s+|char\s+|float\s+|double\s+/g, 'let ');
  
  js = js.replace(/for\s*\(([^)]+)\)\s*\{/g, 'for ($1) {');
  
  js = js.replace(/\*\s*(\w+)/g, '$1');
  js = js.replace(/&\s*(\w+)/g, '$1');
  
  return js;
}

function convertCToPython(code) {
  let python = code;
  
  python = python.replace(/#include\s*<\w+\.h>/g, '');
  
  python = python.replace(/int\s+main\s*\(([^)]*)\)\s*\{/g, 'def main():');
  
  python = python.replace(/printf\(/g, 'print(');
  
  python = python.replace(/int\s+|char\s+|float\s+|double\s+/g, '');
  
  python = python.replace(/for\s*\(([^)]+)\)\s*\{/g, 'for $1:');
  
  python = python.replace(/\*\s*(\w+)/g, '$1');
  python = python.replace(/&\s*(\w+)/g, '$1');
  
  return python;
}

function convertCToJava(code) {
  let java = code;
  
  java = java.replace(/#include\s*<\w+\.h>/g, 'import java.io.*;');
  
  java = java.replace(/int\s+main\s*\(([^)]*)\)\s*\{/g, 'public static void main(String[] args) {');
  
  java = java.replace(/printf\(/g, 'System.out.println(');
  
  java = java.replace(/malloc\(/g, 'new ');
  
  java = java.replace(/free\(/g, '// free');
  
  if (!java.includes('public class')) {
    java = 'public class Main {\n    ' + java.split('\n').join('\n    ') + '\n}';
  }
  
  return java;
}
