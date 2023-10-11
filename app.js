

const Node = function(data, rightChild = null, leftChild = null){
    return { data, rightChild, leftChild}
}

const Tree = function(array){
    let root = null;

    const removeDupes = function(array) {
        return array.filter((item, index) => {
            return array.indexOf(item) === index
        })
    }

    let removedDuped = removeDupes(array);

    const merge = function(leftArr, rightArr){
        const output = [];
        let leftInd = 0;
        let rightInd = 0;

        while(leftInd < leftArr.length && rightInd < rightArr.length){
            let leftEl = leftArr[leftInd];
            let rightEl = rightArr[rightInd];

            if (leftEl < rightEl) {
                output.push(leftEl)
                leftInd ++
            } else {
                output.push(rightEl)
                rightInd ++
            }
        }

        return [...output, ...leftArr.slice(leftInd), ...rightArr.slice(rightInd)]
    }

    const mergeSort = function(array) {
        if (array.length <= 1){ 
            return array 
        }
        const middleInd = Math.floor(array.length/2)
        const leftArr = array.slice(0, middleInd)
        const rightArr = array.slice(middleInd)

        return merge(
            mergeSort(leftArr),
            mergeSort(rightArr)
        )
    }

    let mergeSorted = mergeSort(removedDuped);


    let lengthMergeSorted = mergeSorted.length;

    const buildTree = function(array, start, end) {
        if (start > end) { return null }
        
        //use start and end because the total array remains unchanged. only the start and end keeps changing
        let mid = parseInt((start+end)/2)
        let node = new Node(array[mid]);
        //create the leftChild and rightChild by calling buildTree function on the array from start to middle and middle to end
        node.leftChild = buildTree(array, start, mid -1);
        node.rightChild = buildTree(array, mid+1, end)
        return node;
    }

    const prettyPrint = (node, prefix = "", isLeft = true) => {
        if (node === null) {
          return;
        }
        if (node.rightChild !== null) {
          prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.leftChild !== null) {
          prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    };

    
    let builtTree = buildTree(mergeSorted, 0, lengthMergeSorted-1)
    prettyPrint(builtTree)
  

    const inserting = function(value){
        //INCREASED BIG O METHODS. BAD BAD.
        // mergeSorted.push(value)
        // mergeSorted = mergeSort(removeDupes(mergeSorted));
        // let newBuiltTree = buildTree(mergeSorted, 0, mergeSorted.length-1);
        // prettyPrint(newBuiltTree)
        
        root = insertRec(builtTree, value)

    }

    function insertRec(node, value){

        if(node === null){
            node = new Node(value)
            return node
        }

        if(value < node.data){
            node.leftChild = insertRec(node.leftChild, value);
        } else if (value > node.data){
            node.rightChild = insertRec(node.rightChild, value);
        }

        return node
    }

    const deleting = function(value){
         //INCREASED BIG O METHODS. BAD BAD.
        // mergeSorted.forEach((i,index)=>{
        //     if(i === value) { mergeSorted.splice(index, 1) }
        // })
        // let builtTree = buildTree(mergeSorted, 0, mergeSorted.length -1)
        // prettyPrint(builtTree)

       root = deleteRec(builtTree, value)
       prettyPrint(builtTree)
    }

    function deleteRec(root, value){
        if(root === null) { return root}

        if(root.data > value) {
            root.leftChild = deleteRec(root.leftChild, value)
            return root;
        } else if (root.data < value){
            root.rightChild = deleteRec(root.rightChild, value)
            return root
        }

        if (root.leftChild === null) {
            let temp = root.rightChild;
            delete root;
            return temp;
        } else if (root.rightChild === null) {
            let temp = root.rightChild;
            delete root;
            return temp;
        } else {
            let succParent = root;
            let succ = root.rightChild;

            while(succ.leftChild !== null) {
                succParent = succ;
                succ = succ.leftChild
            } 

            if(succParent !== root){
                succParent.leftChild = succ.leftChild
            } else {
                succParent.rightChild = succ.rightChild
            }

            root.data = succ.data;
            delete succ
            return root
        }
        
    }

    const find = function (value) {
        root = findRec(builtTree, value);
        if (root === null) { console.log("This value is not found") }
        else { return root }
    }
    function findRec(node, value){

        if(node === null || value === node.data){
            return node
        }
        if(value < node.data){
            return findRec(node.leftChild, value);
        } else if (value > node.data){
            return findRec(node.rightChild, value);
        }
    }

    const levelOrder = function(){
        console.log(levelOrderer(builtTree))
    }
    
    let q = [];
    let output = []

    const levelOrderer = function(root){
        if (q.length === 0){
            q.push(root)
        }
        if (root === null){
            q = q.slice(1)
            root = q[0]
            levelOrderer(root)
            return root
        } else if (root === undefined){
            return
        } else {
            if(root.leftChild !== null){
                q.push(root.leftChild)
            }
            if(root.rightChild !== null){
                q.push(root.rightChild)
            }            
        }
        if(q[0] !== null){
            output.push(q[0].data)
        }

        q = q.slice(1)
        root = q[0]
        levelOrderer(root)

        return output
    }

    const inOrder = function(){
        output = [];       
        return inOrderer(builtTree)
    }

    const inOrderer = function(root){
        if (root === null) return;
        inOrderer(root.leftChild)
        output.push(root.data)
        inOrderer(root.rightChild)
        return output
    }

    const preOrder = function(){
        output = [];       
        console.log(preOrderer(builtTree))
    }

    
    const preOrderer = function(root){
        if (root === null) return;
        output.push(root.data)
        preOrderer(root.leftChild)
        preOrderer(root.rightChild)
        return output
    }

    const postOrder = function(){
        output = [];       
        console.log(postOrderer(builtTree))
    }

    
    const postOrderer = function(root){
        if (root === null) return;
        postOrderer(root.leftChild)
        postOrderer(root.rightChild)
        output.push(root.data)
        return output
    }


    const height = function(){
        console.log(heighter(builtTree))  
    }
    const heighter = function (root){
        if (root === null){ return -1}
        return Math.max(heighter(root.leftChild), heighter(root.rightChild)) +1
    }

    const depth = function(){
        console.log(depther(builtTree))
    }
    const depther = function(node){
        if (node === null) { return -1 }
        else {
            let leftDepth = depther(node.leftChild);
            let rightDepth = depther(node.rightChild)

            if (leftDepth > rightDepth) return (leftDepth+1)
            else return (rightDepth+1)
        }
    }

    const isBalanced = function(){
        console.log(isBalancedFn(builtTree))
        prettyPrint(builtTree)
    }

    const isBalancedFn = function(root){
        if (root === null){ return true}
        let left = heighter(root.leftChild)
        let right = heighter(root.rightChild)
        
        if (Math.abs(left-right) <= 1 && isBalancedFn(root.leftChild) === true && isBalancedFn(root.rightChild) === true){
            return true
        }
        return false
    }

    const rebalance = function(){
        rebalancer(builtTree)
    }

    const rebalancer = function(){
        let newArr = inOrder(builtTree)
        console.log(newArr)
        let newTree = buildTree(newArr, 0, newArr.length-1)        
        builtTree = newTree    
    }

    return {
        inserting, deleting, find, levelOrder, preOrder, inOrder, postOrder, height, depth, isBalanced, rebalance
    }
}


let array = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 32, 4, 89, 99, 66, 55];

const newTree = Tree(array);
newTree.isBalanced();

newTree.levelOrder();
newTree.preOrder();
newTree.postOrder();
newTree.inOrder();

newTree.inserting(500)
newTree.inserting(120)
newTree.inserting(115)
newTree.inserting(116)
newTree.inserting(110)

newTree.isBalanced();

newTree.inOrder();
newTree.rebalance();
newTree.isBalanced();