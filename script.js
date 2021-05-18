//Math.numberRoot I found on stackexchange. 
Math.numberRoot = (x, n) => {
	return (((x > 1 || x < -1) && n == 0) ? Infinity : ((x > 0 || x < 0) && n == 0) ? 1 : (x < 0 && n % 2 == 0) ? `${((x < 0 ? -x : x) ** (1 / n))}${"i"}` : (n == 3 && x < 0) ? -Math.cbrt(-x) : (x < 0) ? -((x < 0 ? -x : x) ** (1 / n)) : (n == 3 && x > 0 ? Math.cbrt(x) : (x < 0 ? -x : x) ** (1 / n)));
};

class Calculator {
	//This initializes a new instance of the Calculator class
	constructor(topOperationTextElement, bottomOperationTextElement) {
		this.topOperationTextElement = topOperationTextElement;
		this.bottomOperationTextElement = bottomOperationTextElement;
		this.clearAll();
	}

	clearAll() {
		this.currentOperation = '';
		this.previousOperation = '';
		this.operator = undefined;
	}

	clearOne() {
		this.currentOperation = this.currentOperation.slice(0,-1);
	}

	//5 + 5 = 10 "5" + "5" = "55"
	appendNumber(number) {
		if (number === "." && this.currentOperation.includes(".")) return;
		this.currentOperation = this.currentOperation.toString() + number.toString();
	}

	chooseOperator(operation) {
		if (this.currentOperation == "") return;
		if (this.previousOperation !== "") {
			//both previous and current are numbers so calculate
			this.calculate();
		}
		this.operator = operation;
		this.previousOperation = this.currentOperation;
		this.currentOperation = "";
	}

	factorial(number) {
		let factorialAnswer = 1;
		for (let i=1; i <= number; i++) {
			factorialAnswer *= i;
		}
		return factorialAnswer
	}


	calculate() {
		let answer;
		const firstVar = parseFloat(this.previousOperation);
		const secondVar = parseFloat(this.currentOperation);
		if (isNaN(firstVar) || isNaN(secondVar)) return;

		switch(this.operator) {
			case '+':
				answer = firstVar + secondVar;
				break;
			case '-':
				answer = firstVar - secondVar;
				break;
			case '*':
				answer =  firstVar * secondVar;
				break;
			case '÷':
				if (secondVar === 0) {
					window.alert("ERROR: Divide By Zero");
					answer = "";
					break;
				} else {
					answer = firstVar / secondVar;
					break;
				}
			case '^':
				answer = firstVar ** secondVar;
				break;
			case 'n√(x)':
				console.log(Math.numberRoot(firstVar, secondVar));
				answer = Math.numberRoot(firstVar, secondVar); 
				if (typeof answer === "string") {
					window.alert(`ERROR: Imaginary ${answer}`);
					answer = "";
				}
				break;
			case 'logbx':
				answer = (Math.log(secondVar) / Math.log(firstVar));
				window.alert("This is an approximation. If doing life and death calculations don't use this!")
				break;
			default:
				return;
		}
		this.currentOperation = answer;
		this.operator = undefined;
		this.previousOperation = "";
	}

	changeNegative() {
		if (!isNaN(parseFloat(this.currentOperation))) {
			this.currentOperation = parseFloat(this.currentOperation) * -1;
		}
	}

	getDisplay(number) {
		const stringNumber = number.toString();
		const leftOfDecimal = parseFloat(stringNumber.split(".")[0]);
		const rightOfDecimal = stringNumber.split(".")[1];

		let formattedInteger;
		if (isNaN(leftOfDecimal)) {
			formattedInteger = "";
		} else {
			formattedInteger = leftOfDecimal.toLocaleString('en');
		}

		if (!isNaN(rightOfDecimal)) {
			return `${formattedInteger}.${rightOfDecimal}`;
		} else {
			return formattedInteger;
		}
	}

	updateOutput() {
		this.topOperationTextElement.innerText = this.getDisplay(this.currentOperation); 
		this.bottomOperationTextElement.innerText = this.previousOperation;
		if (this.operator != null) {
			this.bottomOperationTextElement.innerText = `${this.getDisplay(this.previousOperation)} ${this.operator}`;
		} else {
			this.previousOperation = "";
		}
	}
}

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operation]');
const clearButton = document.querySelector('[data-clear-all]');
const clearEntryButton = document.querySelector('[data-clear-one]');
const prependNumberButton = document.querySelector('[data-prepend]');
const equalsButton = document.querySelector('[data-equals]');
const topOperationTextElement = document.querySelector('[data-top-input]');
const bottomOperationTextElement = document.querySelector('[data-bottom-input]');

const calculator = new Calculator(bottomOperationTextElement, topOperationTextElement);

numberButtons.forEach(button => {
	button.addEventListener('click', () => {
		calculator.appendNumber(button.innerText);
		calculator.updateOutput();
	})
});

operatorButtons.forEach(button => {
	button.addEventListener('click', () => {
		calculator.chooseOperator(button.innerText);
		calculator.updateOutput();
	})
});

equalsButton.addEventListener('click', button => {
	calculator.calculate();
	calculator.updateOutput();
});

clearButton.addEventListener('click', button => {
	calculator.clearAll();
	calculator.updateOutput();
});

clearEntryButton.addEventListener('click', button => {
	calculator.clearOne();
	calculator.updateOutput();
})

prependNumberButton.addEventListener('click', button => {
	calculator.changeNegative();
	calculator.updateOutput();
})
