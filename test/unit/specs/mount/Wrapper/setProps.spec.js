import { compileToFunctions } from 'vue-template-compiler'
import { mount } from '~vue-test-utils'
import ComponentWithProps from '~resources/components/component-with-props.vue'
import ComponentWithWatch from '~resources/components/component-with-watch.vue'

describe('setProps', () => {
  let info

  beforeEach(() => {
    info = sinon.stub(console, 'info')
  })

  afterEach(() => {
    info.restore()
  })

  it('sets component props and updates DOM when called on Vue instance', () => {
    const prop1 = 'prop 1'
    const prop2 = 'prop 2'
    const propsData = { prop1: 'a prop', prop2 }
    const wrapper = mount(ComponentWithProps, { propsData })
    wrapper.setProps({ prop1 })
    expect(wrapper.find('.prop-1').element.textContent).to.equal(prop1)
    expect(wrapper.find('.prop-2').element.textContent).to.equal(prop2)
  })

  it('sets component props, and updates DOM when propsData was not initially passed', () => {
    const prop1 = 'prop 1'
    const prop2 = 'prop s'
    const wrapper = mount(ComponentWithProps)
    wrapper.setProps({ prop1, prop2 })
    expect(wrapper.find('.prop-1').element.textContent).to.equal(prop1)
    expect(wrapper.find('.prop-2').element.textContent).to.equal(prop2)
  })

  it('runs watch function when prop is updated', () => {
    const wrapper = mount(ComponentWithWatch)
    const prop1 = 'testest'
    wrapper.setProps({ prop1 })
    expect(wrapper.vm.prop2).to.equal(prop1)
  })

  it('runs watch function after all props are updated', () => {
    const wrapper = mount(ComponentWithWatch)
    const prop1 = 'testest'
    wrapper.setProps({ prop2: 'newProp', prop1 })
    expect(info.args[0][0]).to.equal(prop1)
  })

  it('should update after setProps', () => {
    const prop1 = {}
    const prop2 = 'val1'
    const wrapper = mount(ComponentWithProps, {
      propsData: { prop1, prop2 }
    })

    expect(wrapper.props()).to.eql({ prop1: {}, prop2: 'val1' })
    // setProps
    wrapper.setProps({ prop2: 'val2' })
    expect(wrapper.vm.prop2).to.eql('val2') // pass
    expect(wrapper.props()).to.eql({ prop1: {}, prop2: 'val2' }) // fail
  })

  it('throws an error if node is not a Vue instance', () => {
    const message = 'wrapper.setProps() can only be called on a Vue instance'
    const compiled = compileToFunctions('<div><p></p></div>')
    const wrapper = mount(compiled)
    const p = wrapper.find('p')
    expect(() => p.setProps({ ready: true })).throw(Error, message)
  })
})
