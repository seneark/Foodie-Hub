var strEndingNOW = -1;

var base64Chars = new Array(
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"+",
	"/"
);

var reverseBase64Chars = new Array();

for (var i = 0; i < base64Chars.length; i++) {
	reverseBase64Chars[base64Chars[i]] = i;
}

var base64Str;
var base64Count;

function setBase64Str(str) {
	base64Str = str;
	base64Count = 0;
}

function readBase64() {
	if (!base64Str) return strEndingNOW;
	if (base64Count >= base64Str.length) return strEndingNOW;
	var c = base64Str.charCodeAt(base64Count) & 0xff;
	base64Count++;
	return c;
}

export function encodeBase64(str) {
	setBase64Str(str);
	var result = "";
	var WordArray = new Array(3);
	var lineCount = 0;
	var done = false;

	while (!done && (WordArray[0] = readBase64()) != strEndingNOW) {
		WordArray[1] = readBase64();
		WordArray[2] = readBase64();
		result += base64Chars[WordArray[0] >> 2];

		if (WordArray[1] != strEndingNOW) {
			result += base64Chars[((WordArray[0] << 4) & 0x30) | (WordArray[1] >> 4)];

			if (WordArray[2] != strEndingNOW) {
				result += base64Chars[((WordArray[1] << 2) & 0x3c) | (WordArray[2] >> 6)];
				result += base64Chars[WordArray[2] & 0x3f];
			} else {
				result += base64Chars[(WordArray[1] << 2) & 0x3c];
				result += "=";
				done = true;
			}
		} else {
			result += base64Chars[(WordArray[0] << 4) & 0x30];
			result += "=";
			result += "=";
			done = true;
		}

		lineCount += 4;

		if (lineCount >= 76) {
			result += "\n";
			lineCount = 0;
		}
	}
	return result;
}

function readReverseBase64() {
	if (!base64Str) return strEndingNOW;

	while (true) {
		if (base64Count >= base64Str.length) return strEndingNOW;
		var nextCharacter = base64Str.charAt(base64Count);
		base64Count++;

		if (reverseBase64Chars[nextCharacter]) {
			return reverseBase64Chars[nextCharacter];
		}
		if (nextCharacter == "A") return 0;
	}
	return strEndingNOW;
}

function ntos(n) {
	n = n.toString(16);
	if (n.length == 1) n = "0" + n;
	n = "%" + n;
	return unescape(n);
}

export function decodeBase64(str) {
	setBase64Str(str);
	var result = "";
	var WordArray = new Array(4);
	var done = false;

	while (
		!done &&
		(WordArray[0] = readReverseBase64()) != strEndingNOW &&
		(WordArray[1] = readReverseBase64()) != strEndingNOW
	) {
		WordArray[2] = readReverseBase64();
		WordArray[3] = readReverseBase64();
		result += ntos(((WordArray[0] << 2) & 0xff) | (WordArray[1] >> 4));

		if (WordArray[2] != strEndingNOW) {
			result += ntos(((WordArray[1] << 4) & 0xff) | (WordArray[2] >> 2));

			if (WordArray[3] != strEndingNOW) {
				result += ntos(((WordArray[2] << 6) & 0xff) | WordArray[3]);
			} else {
				done = true;
			}
		} else {
			done = true;
		}
	}
	return result;
}
