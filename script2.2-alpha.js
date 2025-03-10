//ニューロンネットワークのテストのスクリプト
console.log("script is running")

//pythonで言うrangeの関数
function range(n){
    return Array.from({length: n}, (v, k) => k);
}
//ベクトルのプログラム↓
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 上限は除き、下限は含む
}

class Vector{
    constructor(line, column, index = undefined, random = false){
        this.line = line;
        this.column = column;
        this.vector = [];
        if (index == undefined){
            for (var i = 0; i < line; i++){
                var columnsList = [];
                for (var i2 = 0; i2 < column; i2++){
                    if (random){
                        columnsList.push(getRandomArbitrary(-1, 1))
                    }else{
                        columnsList.push(0)
                    }
                }
                this.vector.push(columnsList)
            }
        }else{
            this.vector = index
        }
    }

    getElem(lineIn, columnIn, getByVec = false){
        if (lineIn == undefined){
            //行が指定されていない。つまり、列を指定されている。
            //だから、列一つをすべて
            if (getbyVec){
                return new Vector(1, this.column, [this.vector[columnIn]])
            }else{
                //返り値は配列で、数字が中にある
                return this.vector[columnIn]
            }
        }else if (columnIn == undefined){
            //列が指定されていない。つまり、行を指定されている。
            //だから、行一つをすべて
            var forReturnArray = []
            for (var i in this.vector){
                if (getByVec){
                    forReturnArray.push([this.vector[i][lineIn]])
                }else{
                    forReturnArray.push(this.vector[i][lineIn])
                }
            }
            if (getByVec){
                return new Vector(this.line, 1, forReturnArray)
            }else{
                return forReturnArray
            }
        }
        if (getByVec){
            return new Vector(1, 1, this.vector[lineIn][columnIn])
        }
        return this.vector[lineIn][columnIn]
    }

    setAll(newVec){
        this.vector = newVec
    }

    setElem(lineIn, columnIn, num){
        this.vector[lineIn][columnIn] = num
    }

    setLines(lineIn, list){
        var newList = []
        for (var i = 0; i < this.line; i++){
            var newNum = 0;
            if (list[i] != undefined){
                newNum = list[i]
            }
            newList.push(newNum)
        }
        for (var i = 0; i < this.line; i++){
            this.vector[i][lineIn] = newList[i]
        }
    }

    setColumns(columnIn, list){
        var newList = [];
        for (var i = 0; i < this.column;i ++){
            var newNum = 0;
            if (list[i] != undefined){
                newNum = list[i]
            }
            newList.push(newNum)
        }
        this.vector[columnIn] = newList;
    }

    changeFunk(fn){
        for (var i in this.vector){
            for (var i2 in this.vector[i]){
                this.setElem(i, i2, fn(this.getElem(i, i2)))
            }
        }
        return this
    }
}

class OperateVector{
    add(a, b){
        var newVec = []
        if (a.line == b.line && a.column == b.column){
            for (var vertical = 0;vertical < a.line; vertical ++){
                var verticalVec = []
                for (var beside = 0;beside < a.column; beside ++){
                    var into = a.vector[vertical][beside] + b.vector[vertical][beside]
                    if (into == undefined || into == NaN){
                        console.error(`vertical: ${vertical}, beside: ${beside}, becomes undefined or NaN!`)
                    }
                    verticalVec.push(into)
                }
                newVec.push(verticalVec)
            }
            return new Vector(a.line, a.column, newVec)
        }else{
            console.error("private:OperateVector/add/->a and b is not similar")
        }
        return new Vector(a.line, b.column, newVec)
    }
    scalarTimes(a, s){
        var newVec = []
        for (var vertical in a.vector){
            var verticalVec = [];
            for (var beside in a.vector[vertical]){
                var into = a.vector[vertical][beside] * s
                if (into == undefined || into == NaN){
                    console.error(`vertical: ${vertical}, beside: ${beside}, becomes undefined or NaN!`)
                }
                verticalVec.push(into)
            }
            newVec.push(verticalVec)
        }
        return new Vector(a.line, a.column, newVec)
    }
    times(a, b){
        var theVec = new Vector(a.line, b.column);
        if (a.column == b.line){
            //bの選ばれた列に付いての数。つまり、何行目か
            for (var i = 0;i < b.column;i ++){
                var thisLineVecTotal = new Vector(a.line, 1)
                for (var i2 = 0;i2 < b.line;i2 ++){
                    thisLineVecTotal = this.add(thisLineVecTotal, this.scalarTimes(a.getElem(i2, undefined, true), b.getElem(i2, i)))
                }
                theVec.setLines(i, thisLineVecTotal.getElem(0))
            }
        }else{
            console.error("we cant caculate this vectors")
        }
        return theVec;
    }
    
    hadamardTimes(a, b){
        if (a.line == b.line && a.column == b.column){
            var resultVec = new Vector(a.line, b.column)
            for (var i = 0;i < a.line;i++){
                for (var i2 = 0;i2 < a.column;i2 ++){
                    var elem = a.getElem(i, i2) * b.getElem(i, i2)
                    resultVec.setElem(i, i2, elem)
                }
            }
            return resultVec
        }
        return undefined
    }

    transposition(a){
        var newVec = new Vector(a.column, a.line)
        var newVecArray = []
        for (var i = 0;i < a.column;i ++){
            var newColumnElem = a.getElem(i)
            newVecArray.push(newColumnElem)
        }
        newVec.setAll(newVecArray)

        return newVec;
    }
}

var mathVector = new OperateVector();

const activations = {
    Sigmoid(x){
        return 1 / (1 + Math.exp(x))
    },
    Identify(x){
        return x
    },
    ReLU(x){
        if (x > 0){
            return x
        }else{
            return 0
        }
    },
    searchActivation(str){
        switch (str){
            case "sigmoid":
                return this.Sigmoid
                break;
            case "identify":
                return this.Identify
                break;
            case "relu":
                return this.ReLU
                break;
        }
    }
}

const diffActivations = {
    Sigmoid(x){
        return (1 - activations.Sigmoid(x)) * activations.Sigmoid(x)
    },
    Identify(x){
        return 1;
    },
    ReLU(x){
        if (x > 0){
            return 1
        }else{
            return 0
        }
    },
    searchDiffActivation(str){
        switch(str){
            case "sigmoid":
                return this.Sigmoid
                break;
            case "identify":
                return this.Identify
                break;
            case "relu":
                return this.ReLU
                break;
        }
    }
}

function sigmoid(x){
    return 1 / (1 + Math.exp(x))
}


class NeuronNetwork{
    //ネットワークの層の数のトリセツ
    
    //入力層と出力層一つずつを引いた数が隠れ層の数になる
    //たとえば
    //ネットワークの数を5とすると
    //5-1-1で、３つの隠れ層があるということ

    //また、重みがかかるのは層と層の間であるから、重みの総数は4つ
    //バイアスは入力層にはかからないから、4つある
    constructor(layerNum, layerSize){
        //レイヤーの数（length - 1)
        this.layerQuantity = layerNum

        var network = [];
        for (var i = 0;i < layerNum; i++){
            var layer = new Vector(layerSize[i], 1)
            network.push(layer)
        }
        //ネットワーク本体、内容はVector
        this.network = network;

        var weights = []
        var biases = []

        for (var i = 0; i < layerNum - 1; i++){
            var w = new Vector(this.network[i + 1].line, this.network[i].line, undefined, true)
            weights.push(w)
        }
        //ネットワークの重み
        this.weight = weights

        for (var i = 0; i < layerNum - 1; i++){
            var b = new Vector(this.network[i + 1].line, 1, undefined, true)
            biases.push(b)
        }
        //ネットワークのバイアス
        this.bias = biases
    }

    Play(input, activation){
        this.network[0] = input
        this.receiveNetwork = this.network
        this.activation = []
        for (var i in activation){
            this.activation.push(activations.searchActivation(activation[i]))
        }
        this.activationArray = activation

        // console.log(this.network)
        // console.log(this.weight)
        // console.log(this.bias)

        for (var i = 0; i < this.layerQuantity - 1; i++){
            var elem = mathVector.add(mathVector.times(this.weight[i], this.network[i]), this.bias[i])

            this.receiveNetwork[i + 1] = elem

            elem.changeFunk(this.activation[i])
            this.network[i + 1] = elem
        }

        return this.network[this.layerQuantity - 1]
    }

    Cost(teacher){
        var c = 0;
        var exp = this.network[this.layerQuantity - 1]
        if (exp.column == 1 && teacher.column == 1 && exp.line == teacher.line){
            for (var i = 0;i < exp.line;i ++){
                c += (exp.getElem(i, 0) - teacher.getElem(i, 0))**2
            }
        }else{
            console.error("cost error")
        }
        return c
    }

    FixWeights(teacher, rate){
        //読み取り専用
        var nw = this.network;
        var Rnw = this.receiveNetwork;
        var wg = this.weight;
        var bi = this.bias;

        var diffActivation = []
        for (var i in this.activationArray){
            diffActivation.push(diffActivations.searchDiffActivation(this.activationArray[i]))
        }

        //export -> layer(L-1) -> layer(L-2) -> ・・・ -> layer(2) -> input
        this.devitations = []

        //出力層から隠れそうへの誤差の計算
        var exportLayer = nw[this.layerQuantity - 1]
        
        var devitationFuncVec = new Vector(exportLayer.line, 1)

        devitationFuncVec = mathVector.scalarTimes(mathVector.add(exportLayer, mathVector.scalarTimes(teacher, -1)), 2)
        
        var thisLayerRnw = Rnw[this.layerQuantity - 1]
        thisLayerRnw.changeFunk(diffActivation[i])

        var exportLayerDevi = mathVector.hadamardTimes(devitationFuncVec, thisLayerRnw)

        this.devitations[this.layerQuantity - 1] = exportLayerDevi

        //隠れそうの計算
        for (var i = this.layerQuantity - 2;i > 0;i --){
            var l = nw[i]
            var Rl = Rnw[i]
            var relatedWeight = wg[i]

            var transpositionedWeight = mathVector.transposition(relatedWeight)
            var weightTimesDevi = mathVector.times(transpositionedWeight, this.devitations[i + 1])
            
            Rl.changeFunk(diffActivation[i])
            var devi = mathVector.hadamardTimes(weightTimesDevi, Rl)
            this.devitations[i] = devi
        }

        //重み・バイアスの更新
        for (var i = this.layerQuantity - 2;i >= 0;i --){
            var d = this.devitations[i + 1]
            var l = nw[i]

            var transpositionedL = mathVector.transposition(l)
            var weightInc = mathVector.times(d, transpositionedL)
            
            var biasInc = d

            // this.weight[i] = mathVector.add(wg[i], weightInc)
            // this.bias[i] = mathVector.add(bi[i], biasInc)

            this.weight[i] = mathVector.add(wg[i], mathVector.scalarTimes(weightInc, rate * -1))
            this.bias[i] = mathVector.add(bi[i], mathVector.scalarTimes(biasInc, rate * -1))
        }
    }
}

var network = new NeuronNetwork(4, [2,4,4,2])

var minimumCost = 100;

var times = 0
var ex1 = document.createElement("p")
var ex2 = document.createElement("p")
var ex3 = document.createElement("p")
var ex4 = document.createElement("p")
var activationList = ["sigmoid", "sigmoid", "identify"]
function RunAI(nw, input, teacher, rate){
    times ++;
    var inputVector = new Vector(input.length,1,input)
    
    var teacherVector = new Vector(teacher.length,1,teacher)
    
    // console.log("入力: " + input)
    
    var result = nw.Play(inputVector, activationList)
    
    // console.log("結果 0 :" + result.getElem(0,0) )
    // console.log("結果 1 :" + result.getElem(1,0) )
    
    var cost = nw.Cost(teacherVector)
    
    // console.log("コスト:" + cost)

    if (minimumCost > cost){
        minimumCost = cost
    }

    var documentExport = document.getElementById("doc-export")

    var resultText = `計算回数:${times}回目<br>入力${input};<br>結果0: ${result.getElem(0,0)}, 結果1: ${result.getElem(1,0)},<br> コスト: ${cost};<br><br>最小コスト: ${minimumCost}`
    if (input[0][0] == 1){
        if (input[1][0] == 1){
            ex1.innerHTML = resultText
        }else{
            ex2.innerHTML = resultText
        }
    }else{
        if (input[1][0] == 1){
            ex3.innerHTML = resultText
        }else{
            ex4.innerHTML = resultText
        }
    }

    var resultExport = document.createElement("p")
    resultExport.appendChild(ex1)
    resultExport.appendChild(ex2)
    resultExport.appendChild(ex3)
    resultExport.appendChild(ex4)

    documentExport.innerHTML = ""
    documentExport.appendChild(resultExport)

    nw.FixWeights(teacherVector, rate)
}

function OnlyLearning(nw, input, teacher, rate){
    times ++;
    var inputVector = new Vector(input.length,1,input)
    
    var teacherVector = new Vector(teacher.length,1,teacher)

    var result = nw.Play(inputVector, activationList)
    var cost = nw.Cost(teacherVector)
    
    nw.FixWeights(teacherVector, rate)

    return {result: result, cost: cost}
}

var allRate = 0 + getRandomArbitrary(-1, 1) * 0
var inc = 0.0001
var power = 4
var rates = {"0,0": allRate, "0,1": allRate, "1,1": allRate, "1,0": allRate}
var results = 0
setInterval(()=>{
    for (var i = 0; i < 10; i++){
        
            var input = [
                [0],[1]
            ]
                
            var desired = [
                [1],[0]
            ]
            
            results = OnlyLearning(network, input, desired, allRate + (rates["0,1"]**power) * inc)
            rates["0,1"] = results.cost
    
            var input = [
                [0],[0]
            ]
                
            var desired = [
                [0],[1]
            ]
            
            results = OnlyLearning(network, input, desired, allRate + (rates["0,0"]**power) * inc)
            rates["0,0"] = results.cost
    
            var input = [
                [1],[0]
            ]
                
            var desired = [
                [1],[0]
            ]
            
            results = OnlyLearning(network, input, desired, allRate + (rates["1,0"]**power) * inc)
            rates["1,0"] = results.cost
    
            var input = [
                [1],[1]
            ]
                
            var desired = [
                [0],[0]
            ]
            
            results = OnlyLearning(network, input, desired, allRate + (rates["1,1"]**power) * inc)
            rates["1,1"] = results.cost
        
        }

    var input = [
                [0],[1]
            ]
                
            var desired = [
                [1],[0]
            ]
            
            RunAI(network, input, desired, allRate)
    
            var input = [
                [0],[0]
            ]
                
            var desired = [
                [0],[1]
            ]
            
            RunAI(network, input, desired, allRate)
    
            var input = [
                [1],[0]
            ]
                
            var desired = [
                [1],[0]
            ]
            
            RunAI(network, input, desired, allRate)
    
            var input = [
                [1],[1]
            ]
                
            var desired = [
                [0],[0]
            ]
            
            RunAI(network, input, desired, allRate)
    }, 100)


        

            
