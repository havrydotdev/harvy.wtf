import { newBspNode, type BspNode, type Rect, type Window } from "./node";

export type BspTree = {
    root: BspNode;
    current: BspNode;
    screenRect: Rect;
    lowerRight: boolean;
    ratio: number;

    nodes: () => BspNode[];
    setRect: (rect: Rect) => void;
    addWindow: (data: { title: string }) => void;
    windows: () => Window[];
    remove: () => void;

    findLeft: () => BspNode | null;
    findRight: () => BspNode | null;
    findUp: () => BspNode | null;
    findDown: () => BspNode | null;

    left: () => void;
    right: () => void;
    up: () => void;
    down: () => void;

    shuffleLeft: () => void;
    shuffleRight: () => void;
    shuffleUp: () => void;
    shuffleDown: () => void;
};

export function newBspTree(screenRect: Rect): BspTree {
    const root = newBspNode();

    return {
        root,
        screenRect,
        current: root,
        lowerRight: true,
        ratio: 1.6,

        nodes() {
            return this.root.flat();
        },
        setRect(rect: Rect) {
            this.screenRect = rect;
            this.root.calcGeom(rect);
        },
        addWindow(data: { title: string }) {
            const node = this.root.shortest();
            this.current = node.insert(
                { ...data, id: crypto.randomUUID() },
                this.lowerRight ? 1 : 0,
                this.ratio
            );
            this.root.calcGeom(this.screenRect);
        },
        windows() {
            return this.root.windows();
        },
        remove() {
            if (this.current.parent) {
                this.current = this.current.parent.remove(this.current.nodeId);
                const newClient = this.current.windows()[0];
                if (!newClient) {
                    this.current = this.root;
                } else {
                    this.current = this.nodes().filter((n) => n.window?.id == newClient.id)[0];
                }

                return;
            }

            this.current.window = undefined;
            this.current = this.root;
        },
        findLeft() {
            let child = this.current;
            let parent = child.parent;
            while (parent) {
                if (parent.splitHorizontal && parent.children[1]?.nodeId == child.nodeId) {
                    let neighbor = parent.children[0];
                    let center = this.current.rect.y + this.current.rect.h * 0.5;
                    while (!neighbor?.window) {
                        if (
                            neighbor.splitHorizontal ||
                            (neighbor.children[1] && neighbor.children[1].rect.y < center)
                        ) {
                            neighbor = neighbor.children[1];
                        } else {
                            neighbor = neighbor.children[0];
                        }
                    }

                    return neighbor;
                }

                child = parent;
                parent = child.parent;
            }

            return null;
        },
        findRight() {
            let child = this.current;
            let parent = child.parent;
            while (parent) {
                if (parent.splitHorizontal && parent.children[0]?.nodeId == child.nodeId) {
                    let neighbor = parent.children[1];
                    let center = this.current.rect.y + this.current.rect.h * 0.5;
                    while (!neighbor?.window) {
                        if (
                            neighbor.splitHorizontal ||
                            (neighbor.children[1] && neighbor.children[1].rect.y > center)
                        ) {
                            neighbor = neighbor.children[0];
                        } else {
                            neighbor = neighbor.children[1];
                        }
                    }

                    return neighbor;
                }

                child = parent;
                parent = child.parent;
            }

            return null;
        },
        findUp() {
            let child = this.current;
            let parent = child.parent;
            while (parent) {
                if (!parent.splitHorizontal && parent.children[1]?.nodeId == child.nodeId) {
                    let neighbor = parent.children[0];
                    let center = this.current.rect.x + this.current.rect.w * 0.5;
                    while (!neighbor?.window) {
                        if (
                            !neighbor.splitHorizontal ||
                            (neighbor.children[1] && neighbor.children[1].rect.x < center)
                        ) {
                            neighbor = neighbor.children[1];
                        } else {
                            neighbor = neighbor.children[0];
                        }
                    }

                    return neighbor;
                }

                child = parent;
                parent = child.parent;
            }

            return null;
        },
        findDown() {
            let child = this.current;
            let parent = child.parent;
            while (parent) {
                if (!parent.splitHorizontal && parent.children[0]?.nodeId == child.nodeId) {
                    let neighbor = parent.children[1];
                    let center = this.current.rect.x + this.current.rect.w * 0.5;
                    while (!neighbor?.window) {
                        if (
                            !neighbor.splitHorizontal ||
                            (neighbor.children[1] && neighbor.children[1].rect.x > center)
                        ) {
                            neighbor = neighbor.children[0];
                        } else {
                            neighbor = neighbor.children[1];
                        }
                    }

                    return neighbor;
                }

                child = parent;
                parent = child.parent;
            }

            return null;
        },

        left() {
            const node = this.findLeft();
            if (node) {
                this.current = node;
            }
        },
        right() {
            const node = this.findRight();
            if (node) {
                this.current = node;
            }
        },
        up() {
            const node = this.findUp();
            if (node) {
                this.current = node;
            }
        },
        down() {
            const node = this.findDown();
            if (node) {
                this.current = node;
            }
        },

        shuffleLeft() {
            const node = this.findLeft();
            if (node) {
                const tmp = this.current.window;
                this.current.window = node.window;
                node.window = tmp;

                this.current = node;
            }
        },
        shuffleRight() {
            const node = this.findRight();
            if (node) {
                const tmp = this.current.window;
                this.current.window = node.window;
                node.window = tmp;

                this.current = node;
            }
        },
        shuffleDown() {
            const node = this.findDown();
            if (node) {
                const tmp = this.current.window;
                this.current.window = node.window;
                node.window = tmp;

                this.current = node;
            }
        },
        shuffleUp() {
            const node = this.findUp();
            if (node) {
                const tmp = this.current.window;
                this.current.window = node.window;
                node.window = tmp;

                this.current = node;
            }
        },
    };
}
