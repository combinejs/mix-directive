const directiveProvider = require('@combinejs/directives-provider'),
      blockProvider     = require('@combinejs/blocks-provider'),
      MatchDirective    = directiveProvider('match');

function run(node, mixName) {
    walk(node, blockProvider(mixName), []);
}

function walk(node, mixNode, path) {
    let matchedNodes = MatchDirective.matchNodeByPath(mixNode, path);

    for (let matchedNode of matchedNodes) {
        node.addMixin(matchedNode);
    }

    if (node.hasChilds()) {
        for (let [i, child] of node.getChilds().entries()) {
            path.push(i);
            walk(child, mixNode, path);
        }
    } else {
        if (matchedNodes.reduce((sum, item) => sum += ~~item.hasChilds(), 0) < 2) {
            for (let matchedNode of matchedNodes) {
                if (matchedNode.hasChilds()) {
                    node.setChilds(matchedNodes[0].getChilds());
                }
            }
        } else {
            throw `i d'not make it in this version`;
        }
    }
}

class MixDirective {
    constructor(value, node) {
        this._node      = node;
        this._mixinName = value;
    }
    run() {
        run(this._node, this._mixinName);
    }
}

module.exports = MixDirective;


