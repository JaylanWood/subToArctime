const fs = require('fs')
const translate = require('google-translate-open-api')

const timeRegex = /\[([\d:]+)\]/g
const speakerRegex = />>[a-zA-Z0-9_-\s]+:\s/g
const sliceRegex = /\n/g
const nullRegex = /^$/g
const breakRegex = /\.\s/g

const replaceYouRegex = /您/g
const replaceFnRegex = /功能/g
const replaceScopRegex = /范围/g

const oldPath = './rawText'
const newPath = './output'

textFileToEnCn(oldPath, newPath)

function textFileToEnCn(oldPath, newPath) {
  const files = fs.readdirSync(oldPath).filter((item) => {
    return item != '.DS_Store'
  })
  files.forEach(function (file) {
    const inputPath = `${oldPath}/${file}`
    const outputPath = `${newPath}/${file}`
    fs.readFile(inputPath, 'utf8', function (err, fileStr) {
      dealTextFile(translateToCN, fileStr, outputPath)
    })
  })
}

function dealTextFile(callback, fileStr, outputPath) {
  let stringArray = dealWithString(fileStr)
  callback(stringArray, outputPath);
}

function dealWithString(fileStr) {
  const jLink = {
    replaceString(regex, replaceStr, string) {
      this.string = new String(string || this.string).replace(new RegExp(regex), replaceStr)
      return this
    },
    sliceStringToArray(regex, string) {
      this.array = new String(string || this.string).split(regex)
      return this
    },
    filterArrayItem(regex, array) {
      this.array = (array || this.array).filter(item => !item.match(regex))
      return this
    }
  }
  const stringArray = jLink
    .replaceString(timeRegex, '', fileStr)
    .replaceString(speakerRegex, '')
    .replaceString(breakRegex, '.\n')
    .sliceStringToArray(sliceRegex)
    .filterArrayItem(nullRegex)
    .array
  return stringArray
}

function translateToCN(stringArray, outputPath) {
  translate.default(stringArray, {
    tld: "cn",
    to: "zh-CN",
  }).then((stringArrayEN) => {
    let stringArrayCN = translate.parseMultiple(stringArrayEN.data[0])

    let replacedStringArrayCN = stringArrayCN.map((item) => {
      if (item.includes('您')) {
        return item.replace(replaceYouRegex, '你')
      } else {
        return item
      }
    }).map((item) => {
      if (item.includes('功能')) {
        return item.replace(replaceFnRegex, '函数')
      } else {
        return item
      }
    }).map((item) => {
      if (item.includes('范围')) {
        return item.replace(replaceScopRegex, '作用域')
      } else {
        return item
      }
    })

    let mergeEnCnStringArray = stringArray.reduce(function (arr, v, i) {
      return arr.concat(v, replacedStringArrayCN[i])
    }, [])

    return sliceToLineString = mergeEnCnStringArray.join('\n')

  }).then((lineString) => {
    fs.writeFile(outputPath, lineString, 'utf8', () => {
      console.log(`${outputPath} 成功`)
    })
  })
}