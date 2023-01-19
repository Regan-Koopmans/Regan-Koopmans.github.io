let canvas = document.getElementById('gossip')
let ctx = canvas.getContext('2d')
let width = canvas.width
let height = canvas.height
let nodes = []
let arrows = []
let leader = null
let step_count = 0

function arrangeNodes() {
    let radius = 200
    let centerX = width / 2
    let centerY = height / 2
    let angle = 0
    let angleIncrement = 2 * Math.PI / nodes.length
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        node.x = centerX + radius * Math.cos(angle)
        node.y = centerY + radius * Math.sin(angle)
        angle += angleIncrement
    }
}

class Node {
    constructor(id) {
        this.id = id
        this.color = 'white'
        this.x = 0
        this.y = 0
    }
}

function render() {
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        ctx.beginPath()
        ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = node.color
        ctx.fill()
        ctx.closePath()
    }

    // Draw arrows
    for (let i = 0; i < arrows.length; i++) {
        let arrow = arrows[i]
        let node1 = nodes[arrow[0]]
        let node2 = nodes[arrow[1]]
        ctx.beginPath()
        ctx.moveTo(node1.x, node1.y)
        ctx.lineTo(node2.x, node2.y)
        ctx.strokeStyle = 'red'
        ctx.stroke()
        ctx.closePath()
    }

    // Draw step count
    ctx.font = '20px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText('Step: ' + step_count, 10, 30)
}

for (let i = 0; i < 50; i++) {
    let node = new Node(i)
    nodes.push(node)
}

function step() {
    step_count += 1 
    // For each node of colour red, tell a random node of any colour to become red.
    let redNodes = nodes.filter(node => node.color == 'red')
    if (redNodes.length == 0) {
        let randomNode = nodes[Math.floor(Math.random() * nodes.length)]
        randomNode.color = 'red'
        render()
        return;
    }
    
    nodes_to_make_red = []
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if (node.color == 'red') {
            index = i 
            while (index == i) {
                index = Math.floor(Math.random() * nodes.length)
            }
            arrows.push([i, index])
            nodes_to_make_red.push(index)
        }
    }
    for (let i = 0; i < nodes_to_make_red.length; i++) {
        let node = nodes[nodes_to_make_red[i]]
        node.color = 'red'
    }
    render()
}

function reset() {
    
    step_count = 0
    arrows = []
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        node.color = 'white'
    }
    render()
}

arrangeNodes()
render()

