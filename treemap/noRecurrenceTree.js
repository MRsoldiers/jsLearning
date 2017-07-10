// 遍历单个节点
function traverseNode2(node){
    var divObj2 = document.getElementById("app2");
    divObj2.innerHTML = divObj2.innerHTML + "  " + node.name;
}

// 非递归遍历树
// 作者：张超
function traverseTree2(node){
    if (!node) {
        return;
    }

    var stack = [];
    stack.push(node);
    var tmpNode;
    while (stack.length > 0) {
        tmpNode = stack.pop();
        traverseNode2(tmpNode);
        if (tmpNode.children && tmpNode.children.length > 0) {
            var i = tmpNode.children.length - 1;
            for (i = tmpNode.children.length - 1; i >= 0; i--) {
                stack.push(tmpNode.children[i]);
            }
        }
		
    }
}

traverseTree2(root); 