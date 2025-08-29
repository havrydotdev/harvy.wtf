export type Window = {
    id: string;
    title: string;
    rect: Rect;
};

export type WindowData = {
    id: string;
    title: string;
};

export type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export type BspNode = {
    children: BspNode[];
    splitHorizontal: boolean;
    splitRatio: number;
    rect: Rect;
    nodeId: string;
    window?: WindowData;
    parent: BspNode | null;

    flat: () => BspNode[];

    windows: () => Window[];
    shortest: () => BspNode;

    insert: (window: WindowData, idx: number, ratio: number) => BspNode;
    remove: (childNodeId: string) => BspNode;
    distribute: () => [number, number];
    calcGeom: (rect: Rect) => void;
};

export function newBspNode(parent: BspNode | null = null): BspNode {
    return {
        parent,
        children: [],
        splitHorizontal: false,
        splitRatio: 50,
        rect: { x: 0, y: 0, w: 16, h: 9 },
        nodeId: crypto.randomUUID(),
        window: undefined,

        flat() {
            let res: BspNode[] = [this];
            this.children.forEach((c) => (res = [...res, ...c.flat()]));

            return res;
        },

        windows() {
            if (this.window) return [{ ...this.window, rect: this.rect }];

            return this.children.map((c) => c.windows()).flat();
        },

        shortest(): BspNode {
            if (this.children.length == 0) {
                return this;
            }

            return this.children[1].shortest();
        },

        insert(window: WindowData, idx: number, ratio: number): BspNode {
            if (!this.window) {
                this.window = window;
                return this;
            }

            this.children = [newBspNode(this), newBspNode(this)];
            this.children[1 - idx].window = this.window;
            this.children[idx].window = window;
            this.window = undefined;
            this.splitHorizontal = !this.parent?.splitHorizontal;

            return this.children[idx];
        },

        remove(childNodeId: string): BspNode {
            const keepIdx = childNodeId == this.children[0].nodeId ? 1 : 0;
            const keep = this.children[keepIdx];

            this.children = keep.children;
            this.splitHorizontal = keep.splitHorizontal;
            this.splitRatio = keep.splitRatio;
            this.window = keep.window;

            for (let i = 0; i < this.children.length; i++) {
                this.children[i].parent = this;
            }

            return this;
        },

        distribute() {
            if (this.children.length == 0) return [1, 1];

            const [h0, v0] = this.children[0].distribute();
            const [h1, v1] = this.children[0].distribute();

            const [h, v] = this.splitHorizontal ? [h0 + h1, Math.max(v0, v1)] : [Math.max(h0, h1), v0 + v1];
            this.splitRatio = this.splitHorizontal ? (100 * h0) / h : (100 * v0) / v;

            return [h, v];
        },

        calcGeom(rect: Rect) {
            this.rect = rect;
            if (this.children.length < 1) return;

            if (this.splitHorizontal) {
                const w0 = Math.round(this.splitRatio * rect.w * 0.01 + 0.5);
                const paddingLeft = this.children.length == 2 ? 6 : 0;
                this.children[0].calcGeom({ ...rect, w: w0 });
                this.children[1].calcGeom({
                    ...rect,
                    x: rect.x + w0 + paddingLeft,
                    w: rect.w - w0 - paddingLeft,
                });
            } else {
                const h0 = Math.round(this.splitRatio * rect.h * 0.01 + 0.5);
                const paddingTop = this.children.length == 2 ? 6 : 0;
                this.children[0].calcGeom({ ...rect, h: h0 });
                this.children[1].calcGeom({
                    ...rect,
                    y: rect.y + h0 + paddingTop,
                    h: rect.h - h0 - paddingTop,
                });
            }
        },
    };
}
