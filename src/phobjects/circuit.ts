import { Group, Phobject, Line } from "./phobject";
import { Vector } from "vector";

interface Connection {
	in: Phobject[];
	out: Phobject[];
	flow: Number;
}

export class Circuit extends Group {
	connections: Connection[];
	nodes: Phobject[];

	constructor(connections: Connection[], nodes: Phobject[]) {
		super();
		this.connections = connections;
		this.nodes = nodes;
		this.setPhobjects();
	}

	setPhobjects() {
		this.nodes.forEach((node) => this.add(node));
		this.connections.forEach((connection) => {
			connection.in.forEach((inPhobject) => {
				connection.out.forEach((outPhobject) => {
					const line = new Line(
						inPhobject.position,
						outPhobject.position,
					);
					this.add(line);
				});
			});
		});
	}
}
