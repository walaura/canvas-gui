interface View {
	x: number;
	y: number;
	width: number;
	height: number;
	subviews?: View[];
}

const views: View[] = [
	{
		x: 20,
		y: 20,
		width: 60,
		height: 60,
		subviews: [{ x: 10, y: 10, width: 20, height: 20 }],
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

const nestView = (main: View, child: View): View => ({
	...child,
	x: main.x + child.x,
	y: main.y + child.y,
});

const drawView = (imageData: Uint8ClampedArray, view: View) => {
	loopyLoop(imageData, ({ i, x, y }) => {
		if (
			x >= view.x &&
			y >= view.y &&
			x <= view.x + view.width &&
			y <= view.y + view.height
		) {
			let color = COLORS.view;
			if (x === view.x || y === view.y) {
				color = COLORS.borderRaised;
			}
			if (x === view.x + view.width || y === view.y + view.height) {
				color = COLORS.borderSunk;
			}
			applyColorAt(imageData, i, color);
		}
	});
	if (view.subviews) {
		for (let subview of view.subviews) {
			drawView(imageData, nestView(view, subview));
		}
	}
};

const loopyLoop = (
	imageData: Uint8ClampedArray,
	callback: ({ x, y, i }: { x: number; y: number; i: number }) => void
): void => {
	const t0 = performance.now();

	for (var i = 0; i < imageData.length; i = i + 4) {
		const x = Math.floor(i / 4) % SCREEN_WIDTH;
		const y = Math.floor(i / 4 / SCREEN_WIDTH);
		callback({ x, y, i });
	}
	const t1 = performance.now();
	console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
};

(() => {
	loopyLoop(myImageData.data, ({ i }) => {
		applyColorAt(myImageData.data, i, COLORS.desktop);
	});
	for (let view of views) {
		drawView(myImageData.data, view);
	}
	ctx.putImageData(myImageData, 0, 0);
})();
