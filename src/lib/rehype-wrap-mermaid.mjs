import { visit } from 'unist-util-visit';

/** Wrap inline Mermaid SVGs so wide diagrams scroll on small screens without shifting the whole page. */
export function rehypeWrapMermaid() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (!parent || index === undefined) return;
			const id = node.properties?.id;
			if (node.tagName !== 'svg' || typeof id !== 'string' || !id.startsWith('mermaid-')) {
				return;
			}
			parent.children[index] = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['mermaid-scroll'] },
				children: [node],
			};
		});
	};
}
