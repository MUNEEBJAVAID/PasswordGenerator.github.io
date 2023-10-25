const passwordDisplay = document.querySelector("[dataPassDisplay]");
const copyData = document.querySelector("[copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlide]");
const UppercaseCheck = document.querySelector("#Uppercase");
const LowercaseCheck = document.querySelector("#Lowercase");
const NumbersCheck = document.querySelector("#Numbers");
const SybmolsCheck = document.querySelector("#Sybmols");
const Indicator = document.querySelector("[strengthIndicator]");
const PasswordGenerateBtn = document.querySelector(".generateBtn");
const copyBtn = document.querySelector(".copyBtn");
const allCheckBox = document.querySelectorAll("input[type = checkbox]");
const Sybmols = `~!@#$%^&*()}{":><?';.,/+}`;

let password = "";
let passwordLength = 10;
lengthDisplay.innerText = passwordLength;

// displayLength on UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

function setIndicator(color) {
    Indicator.style.cssText = `background-color: ${color}; box-shadow: 0px 0px 12px 1px ${color};`;
}

function getRndIntger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
    return getRndIntger(0, 10);
}

function generateLowerCase() {
    // ASCII Value to char
    return String.fromCharCode(getRndIntger(97, 123));
}

function generateUpperCase() {
    // ASCII Value to char
    return String.fromCharCode(getRndIntger(65, 91));
}


function generateRandomSymbol() {
    // first way
    // let RandomIndex =getRndIntger(0 , Sybmols.length+1);
    // return Sybmols[RandomIndex];

    // second way using ASCII
    return String.fromCharCode(getRndIntger(33, 48));

}


function CalcStrength() {
    let isUpperChecked = false;
    let isLoweChecked = false;
    let isNumberChecked = false;
    let isSymbolChecked = false;

    if (UppercaseCheck.checked) isUpperChecked = true;
    if (LowercaseCheck.checked) isLoweChecked = true;
    if (NumbersCheck.checked) isNumberChecked = true;
    if (SybmolsCheck.checked) isSymbolChecked = true;

    if (isUpperChecked && isLoweChecked && (isNumberChecked || isSymbolChecked) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((isUpperChecked || isLoweChecked) && (isNumberChecked || isSymbolChecked) && passwordLength >= 8) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyData.innerText = "copied";
    }
    catch (e) {
        copyData.innerText = "Failed";
    }

    copyData.classList.add("active");
    copyBtn.classList.add('zoomed');

    setTimeout(value => {
        copyData.classList.remove("active");
        copyBtn.classList.remove('zoomed'); 
    }, 2000);

}
function CheckBoxCount() {
    let checkBoxCount = 0;

    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkBoxCount++;
    });

    return checkBoxCount;
}


function shufflePassword(arr) {

    for (let index = arr.length - 1; index > 0; index--) {
        let randomIndex = getRndIntger(0, index + 1);

        //   swap
        let temp = arr[index];
        arr[index] = arr[randomIndex];
        arr[randomIndex] = arr[temp];
    }

    let str = "";
    arr.forEach(elem => str += elem);

    return str;
}

PasswordGenerateBtn.addEventListener('click', (e) => {
    // e.preventDefault(); // Default form submission behavior rokne ke liye

    let checkBoxCount = CheckBoxCount();

    // special condition 
    if (passwordLength < checkBoxCount) {
        passwordLength = checkBoxCount;
        handleSlider();
    }

    password = "";
    let functionArray = [];

    if (UppercaseCheck.checked) functionArray.push(generateUpperCase);
    if (LowercaseCheck.checked) functionArray.push(generateLowerCase);
    if (NumbersCheck.checked) functionArray.push(generateRandomNumber);
    if (SybmolsCheck.checked) functionArray.push(generateRandomSymbol);


    // shuffle Password 
    for (let index = 0; index < passwordLength; index++) {
        let randomIndex = getRndIntger(0, functionArray.length);
        password += functionArray[randomIndex]();
    }


    // show password
    passwordDisplay.value = password;

    // strength indicator
    CalcStrength();
});



copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
   
});



allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', CheckBoxCount);
})

