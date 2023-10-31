var count = 0
const lazyLoad = {
  inserted: function(el) {
    // console.log(el)
  },
  bind: function(el, bind, vnode) {
    count = 0
    function loadImage() {
      const isImg = el.nodeName === "IMG"
      // 이미지 태그일 경우만 url 입력 로딩
      if (isImg) {
        el.src = el.dataset.url
        vnode.context.$emit('Load_IMAGE', {
          count: ++count,
          el: el,
          vnode: vnode
        })
      }
    }

    function buildThresholdList() {
      let thresholds = []
      let numSteps = 50

      for (let i=1.0; i<=numSteps; i++) {
        let ratio = i/numSteps
        thresholds.push(ratio)
      }

      thresholds.push(0)
      return thresholds
    }

    function createObserver() {
      // const option = {
      //   root: document.getElementById('bmImageCardWrapper'),
      //   rootMargin: '0px',
      //   threshold: buildThresholdList()
      // }

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(function(entry, index) {
          if (entry.isIntersecting) { // 감지대상이 교차영역에 진입 할 경우
            loadImage() // 교차영역 들어올경우 이미지 로딩
            observer.unobserve(el) // 이미지 로딩 이후론 관찰할 필요 x
          }
        })
      })

      observer.observe(el)
    }

    // 지원하지 않는 브라우저는 바로 이미지 로딩을 시켜주도록 호환성 체크
    window["IntersectionObserver"] ? createObserver() : loadImage()
  }
}

export default {
  lazyLoad
}
