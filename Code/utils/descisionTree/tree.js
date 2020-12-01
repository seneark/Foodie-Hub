class DescisionTree {
	constructor(value, qtn, params = []) {
		this.value = value;
		this.descendents = [];
		if (params)
			for (let i = 0; i < params.length; i++) {
				this.descendents.push(params[i]);
			}
		this.qtn = qtn;
		this.isTerm = false;
		if (params.length > 1) this.isTerm = true;
	}

	findPreference(base, choice) {
		console.log(base.qtn);
		if (base.isTerm === false) {
			console.log(choice);
			base = base.descendents[choice];
			choice = parseInt(Math.random() * base.descendents.length);
			this.findPreference(base, choice);
		} else {
			console.log(base.descendents);
			console.log("End");
		}
	}
}

// Base Node
let base = new DescisionTree(0, "Do you need Liquid Food or Solid one ?", []);
let left = new DescisionTree(
	"Solid Food",
	"What kind of Solid food or for what occassion"
);
let right = new DescisionTree("Liquid Food", "None", [
	"Beverages,Cu,270",
	"Coffee,Cu,1040",
	"Juices,Cu,164",
	"Bar Food,Cu,227",
	"Bubble Tea,Cu,247",
	"Tea,Cu,163"
]);
base.descendents.push(left, right);

// Left Node
let l1 = new DescisionTree("Special Occassions", "None", [
	"Dine Out,C,2",
	"NightLife,C,3",
	"Catching-up,C,4",
	"Cafes,C,6",
	"Cafe,Cu,30"

]);
let c1 = new DescisionTree("Time Specific Meal", "None", [
	"Breakfast,C,8",
	"Lunch,C,9",
	"Dinner,C,10",
]);

let r1 = new DescisionTree(
	"Something Else",
	"Wanna try Different Cuisines, Healthy Food or Something Else",
	[]
);

left.descendents.push(l1, c1, r1);

// Right Node
let l2 = new DescisionTree("Cuisines", "Try Different Cuisines or Randomize", [
	"Select from Cuisines",
	"Randomize",
]);
let c2 = new DescisionTree("Healthy Food", "none", [
	"Healthy food,Cu,143",
	"Sandwich,Cu,304",
	"Salad,Cu,998"
]);
let r2 = new DescisionTree(
	"Something Else",
	"Still haven't found what you were looking for?",
	[]
);

r1.descendents.push(l2, c2, r2);

// right node
let l3 = new DescisionTree(
	"Fast Food",
	"Health is for idiot give me those fries",
	[
		"BBQ,Cu,193",
		"Burger,Cu,168",
		"Desserts,Cu,100",
		"Fast Food,Cu,40",
		"Hot dogs,Cu,1026",
		"Ice Cream,Cu,233",
		"Momos,Cu,1051",
		"Pizza,Cu,82",
	]
);
let r3 = new DescisionTree("Sweet", "Sweet food", [
	"Bakery,Cu,5",
	"Mithai,Cu,1015",
]);

r2.descendents.push(l3, r3);

export default base;
