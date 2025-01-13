import * as d3 from 'd3';

type DataType = {
	name: string;
	value: number;
	color: string;
};

export type BarGraphData = DataType[];

type BarGraphConfig = {
	margin?: { top: number; right: number; bottom: number; left: number };
	width?: number;
	height?: number;
};

export const BarGraph = function () {
	let margin = { top: 20, right: 20, bottom: 30, left: 40 };
	let width = 600 - margin.left - margin.right;
	let height = 400 - margin.top - margin.bottom;

	let svg: d3.Selection<SVGGElement, unknown, null, undefined>;
	let x: d3.ScaleBand<string>;
	let y: d3.ScaleLinear<number, number>;

	const setupGraph = (
		selector: HTMLDivElement,
		graphData: BarGraphData,
		config?: BarGraphConfig
	) => {
		if (config) {
			margin = config.margin || margin;
			width = config.width || width;
			height = config.height || height;
		}

		d3.select(selector).selectAll('*').remove();

		// root svg
		svg = d3
			.select(selector)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// x axis
		x = d3
			.scaleBand()
			.range([0, width])
			.padding(0.1)
			.domain(graphData.map((d) => d.name));

		// y axis
		y = d3
			.scaleLinear()
			.range([height, 0])
			.domain([0, d3.max(graphData, (d) => d.value + 10) || 0]);

		// draw x axis
		svg
			.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.style('stroke-width', 2);

		// draw y axis
		svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y)).style('stroke-width', 2);

		// colors
		const defs = svg.append('defs');
		graphData.forEach(({ color }, i) => {
			const pattern = defs
				.append('pattern')
				.attr('id', `line-pattern-${i}`)
				.attr('patternUnits', 'userSpaceOnUse')
				.attr('width', 10)
				.attr('height', 10)
				.attr('patternTransform', 'rotate(45)');

			// Add the line to the pattern
			pattern
				.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', 0)
				.attr('y2', 10)
				.attr('stroke', color)
				.attr('stroke-width', 5);
		});

		// bars
		svg
			.selectAll('.bar')
			.data(graphData)
			.enter()
			.append('path')
			.attr('d', (d) => {
				const xPos = x(d.name) || 0;
				const yPos = y(d.value);
				const width = x.bandwidth();
				const subHeight = height - y(d.value);
				const radius = 5; // radius for top corners

				return `
            M ${xPos + radius} ${yPos}
            Q ${xPos} ${yPos} ${xPos} ${yPos + radius}
            L ${xPos} ${yPos + subHeight}
            L ${xPos + width} ${yPos + subHeight}
            L ${xPos + width} ${yPos + radius}
            Q ${xPos + width} ${yPos} ${xPos + width - radius} ${yPos}
            L ${xPos + radius} ${yPos}
            Z
        `;
			})
			.attr('class', 'bar')
			.style('fill', (d, i) => {
				return `url(#line-pattern-${i})`;
			})
			.style('stroke', 'white')
			.style('stroke-width', 2);
	};

	const updateGraph = (newData: BarGraphData) => {
		// update domains
		x.domain(newData.map((d) => d.name));
		y.domain([0, d3.max(newData, (d) => d.value + 10) || 0]);

		// update axes
		svg.select<SVGGElement>('.x-axis').transition().duration(750).call(d3.axisBottom(x));
		svg.select<SVGGElement>('.y-axis').transition().duration(750).call(d3.axisLeft(y));

		// remove old bars
		const bars = svg.selectAll<SVGPathElement, DataType>('.bar').data(newData);
		bars.exit().transition().duration(750).attr('height', 0).attr('y', height).remove();

		// add new bars
		const newBars = bars.enter().append('path').attr('class', 'bar');

		// update the bars
		bars
			.merge(newBars)
			.transition()
			.duration(750)
			.attr('d', (d) => {
				const xPos = x(d.name) || 0;
				const yPos = y(d.value);
				const width = x.bandwidth();
				const subHeight = height - y(d.value);
				const radius = 5; // radius for top corners

				return `
            M ${xPos + radius} ${yPos}
            Q ${xPos} ${yPos} ${xPos} ${yPos + radius}
            L ${xPos} ${yPos + subHeight}
            L ${xPos + width} ${yPos + subHeight}
            L ${xPos + width} ${yPos + radius}
            Q ${xPos + width} ${yPos} ${xPos + width - radius} ${yPos}
            L ${xPos + radius} ${yPos}
            Z
        `;
			})
			.attr('class', 'bar')
			.style('fill', (d, i) => {
				return `url(#line-pattern-${i})`;
			})
			.style('stroke', 'white')
			.style('stroke-width', 2);
	};

	return {
		setupGraph,
		updateGraph
	};
};
