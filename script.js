//ベクトルの計算式
console.log("script is running")

//pythonで言うrangeの関数
function range(n){
    return Array.from({length: n}, (v, k) => k);
}
//ベクトルのプログラム↓
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
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
}

var mathVector = new OperateVector();

var firstVector = new Vector(3, 3, 
                             [
                                 [1,2,3],
                                 [4,5,6],
                                 [7,8,9]
                            ])
var secondVector = new Vector(3, 1,
                              [
                                  [-1],
                                  [-2],
                                  [-3]
                            ])

console.log(mathVector.times(firstVector, secondVector))