const views = [
	{
		x: 20,
		y: 20,
		width: 60,
		height: 60,
	},
];

const COLORS = {
	desktop: [2, 130, 130, 255],
	view: [190, 190, 190, 255],
	borderRaised: [230, 230, 230, 255],
	borderSunk: [120, 120, 120, 255],
};

const [SCREEN_WIDTH, SCREEN_HEIGHT] = [600, 400];

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

var myImageData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);

const applyColorAt = (
	imageData: Uint8ClampedArray,
	index: number,
	color: number[]
) => {
	for (let i = 0; i < color.length; i++) {
		imageData[index + i] = color[i];
	}
};

for (var i = 0; i < myImageData.data.length; i = i + 4) {
	const x = Math.floor(i / 4) % SCREEN_WIDTH;
	const y = Math.floor(i / 4 / SCREEN_WIDTH);

	if (
		x >= views[0].x &&
		y >= views[0].y &&
		x <= views[0].x + views[0].width &&
		y <= views[0].y + views[0].height
	) {
		let color = COLORS.view;
		if (x === views[0].x || y === views[0].y) {
			color = COLORS.borderRaised;
		}
		if (
			x === views[0].x + views[0].width ||
			y === views[0].y + views[0].height
		) {
			color = COLORS.borderSunk;
		}
		applyColorAt(myImageData.data, i, color);
	} else {
		applyColorAt(myImageData.data, i, COLORS.desktop);
	}
}

ctx.putImageData(myImageData, 0, 0);
