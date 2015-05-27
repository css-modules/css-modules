import postcss from 'postcss'

const processor = (css, result) => {
}

processor.defaultRandomStr = () => Math.random().toString(36).substr(2, 8)
processor.getRandomStr = processor.defaultRandomStr // Easy to be mocked out

export default processor
