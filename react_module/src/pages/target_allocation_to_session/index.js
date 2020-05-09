/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-prototype-builtins */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */

import React from 'react'
import { Helmet } from 'react-helmet'
import { Button, Drawer } from 'antd'
import Sortable from 'react-sortablejs'
import { connect } from 'react-redux'
import style from './style.module.scss'
import Authorize from '../../components/LayoutComponents/Authorize'
import SessionDetails from './sessiondetails'

@connect(({ user, sessiontargetallocation }) => ({ user, sessiontargetallocation }))
class ExtraAppsJiraAgileBoard extends React.Component {
  state = {
    visible: false,
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'sessiontargetallocation/GET_ALLOCATED_TARGETS',
      payload: {
        studentId: 'U3R1ZGVudFR5cGU6MTYz',
      },
    })
  }

  showDrawer = session => {
    const { dispatch } = this.props
    dispatch({
      type: 'sessiontargetallocation/SET_STATE',
      payload: {
        CurrentSession: session,
      },
    })

    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  saveSessionTargets = session => {
    const {
      dispatch,
      sessiontargetallocation: { MorningSession, AfternoonSession, EveningSession, CurrentSession },
    } = this.props
    let id = null
    let rawString = []
    if (session === 'Morning') {
      rawString = localStorage.getItem('Morning').split('|')
      console.log(rawString)
      id = MorningSession.id
    }
    if (session === 'Afternoon') {
      rawString = localStorage.getItem('Afternoon').split('|')
      console.log(rawString)
      id = AfternoonSession.id
    }
    if (session === 'Evening') {
      rawString = localStorage.getItem('Evening').split('|')
      console.log(rawString)
      id = EveningSession.id
    }

    dispatch({
      type: 'sessiontargetallocation/UPDATE_SESSION',
      payload: {
        session: session,
        id: id,
        targetList: rawString,
      },
    })
  }

  printDetails = () => {
    const { morningSession, afternoonSession, eveningSession, a_s } = this.state
    console.log(morningSession, afternoonSession, eveningSession, a_s)
  }

  render() {
    const {
      sessiontargetallocation: {
        loading,
        AllocatedTargetsList,
        MorningSession,
        AfternoonSession,
        EveningSession,
        CurrentSession,
      },
    } = this.props

    if (loading) {
      return 'loading targets...'
    }

    const allocatedTargetsListDivs = []
    const morningSessionDiv = []
    const afternoonSessionDiv = []
    const eveningSessionDiv = []

    AllocatedTargetsList.map(item => {
      allocatedTargetsListDivs.push(
        <div
          className={item.node.id}
          id={item.node.id}
          style={{
            backgroundColor: 'white',
            borderRadius: '3px',
            boxShadow: '0 3px 5px rgba(22, 22, 53, 0.16)',
            marginBottom: 15,
            padding: 5,
            minHeight: 40,
            cursor: 'move',
          }}
          key={item.node.id}
        >
          <div className={style.content}>
            <div className={`${style.flag} bg-primary`} />
            <div className="d-flex flex-wrap-reverse align-items-center">
              <h5 className="text-dark font-size-18 mt-2 mr-auto">
                {item.node.targetAllcatedDetails.targetName}
              </h5>
              <i className="fe fe-arrow-right-circle text-danger font-size-30 flex-shrink-0" />
            </div>
          </div>
        </div>,
      )
    })

    if (MorningSession && MorningSession.targets.edges.length > 0) {
      MorningSession.targets.edges.map(item => {
        morningSessionDiv.push(
          <div
            className={item.node.id}
            id={item.node.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '3px',
              boxShadow: '0 3px 5px rgba(22, 22, 53, 0.16)',
              marginBottom: 15,
              padding: 5,
              minHeight: 40,
              cursor: 'move',
            }}
            key={item.node.id}
          >
            <div className={style.content}>
              <div className={`${style.flag} bg-primary`} />
              <div className="d-flex flex-wrap-reverse align-items-center">
                <h5 className="text-dark font-size-18 mt-2 mr-auto">
                  {item.node.targetAllcatedDetails.targetName}
                </h5>
                <i className="fe fe-arrow-right-circle text-danger font-size-30 flex-shrink-0" />
              </div>
            </div>
          </div>,
        )
      })
    }

    if (AfternoonSession && AfternoonSession.targets.edges.length > 0) {
      AfternoonSession.targets.edges.map(item => {
        afternoonSessionDiv.push(
          <div
            className={item.node.id}
            id={item.node.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '3px',
              boxShadow: '0 3px 5px rgba(22, 22, 53, 0.16)',
              marginBottom: 15,
              padding: 5,
              minHeight: 40,
              cursor: 'move',
            }}
            key={item.node.id}
          >
            <div className={style.content}>
              <div className={`${style.flag} bg-primary`} />
              <div className="d-flex flex-wrap-reverse align-items-center">
                <h5 className="text-dark font-size-18 mt-2 mr-auto">
                  {item.node.targetAllcatedDetails.targetName}
                </h5>
                <i className="fe fe-arrow-right-circle text-danger font-size-30 flex-shrink-0" />
              </div>
            </div>
          </div>,
        )
      })
    }

    if (EveningSession && EveningSession.targets.edges.length > 0) {
      EveningSession.targets.edges.map(item => {
        eveningSessionDiv.push(
          <div
            className={item.node.id}
            id={item.node.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '3px',
              boxShadow: '0 3px 5px rgba(22, 22, 53, 0.16)',
              marginBottom: 15,
              padding: 5,
              minHeight: 40,
              cursor: 'move',
            }}
            key={item.node.id}
          >
            <div className={style.content}>
              <div className={`${style.flag} bg-primary`} />
              <div className="d-flex flex-wrap-reverse align-items-center">
                <h5 className="text-dark font-size-18 mt-2 mr-auto">
                  {item.node.targetAllcatedDetails.targetName}
                </h5>
                <i className="fe fe-arrow-right-circle text-danger font-size-30 flex-shrink-0" />
              </div>
            </div>
          </div>,
        )
      })
    }

    const targetSortableStyle = { height: 540, overflow: 'auto' }
    const sessionsSortableStyle = { height: 500, overflow: 'auto', marginTop: '10px' }
    const detailsButton = { backgroundColor: '#f4f6f8' }

    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <div>
          <Helmet title="Jira Agile Board" />

          <div className="row">
            <div className="col-lg-3 col-md-6">
              {/* <button onClick={this.printDetails}>Print</button> */}
              <div className="card bg-light py-3 px-2">
                <h3 className="font-weight-bold text-dark font-size-18 mb-3">Targets</h3>
                <Sortable
                  options={{
                    group: {
                      name: 'shared',
                      pull: 'clone',
                      // put: false, // Do not allow items to be put into this list
                      // forceFallback: true,
                      put: function(to, el, node) {
                        console.log(node.id)
                        var check = true
                        for (var key in to.el.children) {
                          // console.log(key);
                          if (to.el.children.hasOwnProperty(key)) {
                            // console.log(key , to.el.children[key].id);
                            if (to.el.children[key].id === node.id) {
                              check = true
                            }
                          }
                        }
                        // console.log(to.el.children.each(function(index, value) {console.log(index, value)}), el, node)
                        // to.el.children.map(item => console.log(item))
                        return check
                        // return to.el.children.some(item => item.id === node.item.id)
                      },
                      add: function(/* *Event */ evt) {
                        console.log('trigger')
                      },
                    },
                  }}
                  tag="div"
                  style={targetSortableStyle}
                >
                  {allocatedTargetsListDivs}
                </Sortable>
              </div>
            </div>
            {MorningSession ? (
              <div className="col-lg-3 col-md-6">
                <div className="card py-3 px-2" style={{ border: '1px solid #f4f6f8' }}>
                  <h3 className="font-weight-bold text-dark font-size-18 mb-3">
                    Morning Session{' '}
                    <span style={{ float: 'right' }}>
                      <Button onClick={() => this.saveSessionTargets('Morning')} type="link">
                        Save
                      </Button>
                    </span>{' '}
                  </h3>
                  <Button
                    type="dashed"
                    style={detailsButton}
                    onClick={() => this.showDrawer('Morning')}
                    block
                  >
                    {' '}
                    Session details & Host
                  </Button>
                  <Sortable
                    options={{
                      group: {
                        name: 'shared',
                        put: function(to, el, node) {
                          console.log(node.id)
                          var check = true
                          for (var key in to.el.children) {
                            // console.log(key);
                            if (to.el.children.hasOwnProperty(key)) {
                              // console.log(key , to.el.children[key].id);
                              if (to.el.children[key].id === node.id) {
                                check = false
                              }
                            }
                          }
                          // console.log(to.el.children.each(function(index, value) {console.log(index, value)}), el, node)
                          // to.el.children.map(item => console.log(item))
                          return check
                          // return to.el.children.some(item => item.id === node.item.id)
                        },
                      },
                      // onRemove: (node) => {
                      //     console.log(node.type)
                      //     console.log(node.item.id)
                      //     console.log(node.item.innerText)
                      //     console.log(node)

                      //     const newItems = this.state.morningSession.filter(item => item.key !== node.item.id);
                      //     this.setState({ morningSession: newItems })
                      // },
                      // onAdd: (node) => {
                      //     console.log(node.type)
                      //     console.log(node.item.id)
                      //     console.log(node.item.innerText)
                      //     console.log(node)
                      //     this.setState({ morningSession: [...this.state.morningSession, { key: node.item.id, text: node.item.innerText }] });
                      // },
                      store: {
                        // Get the order of elements. Called once during initialization.
                        // @param   {Sortable}  sortable
                        // @returns {Array}
                        get: function(sortable) {
                          console.log(sortable.el.childNodes)
                          let i = 0
                          const list = []
                          for (i = 0; i < sortable.el.childNodes.length; i++) {
                            list.push(`"${sortable.el.childNodes[i].id}"`)
                          }
                          localStorage.setItem('Morning', list.join('|'))
                        },
                        // Save the order of elements.
                        // @param {Sortable}  sortable
                        set: function(sortable) {
                          console.log(sortable.el.childNodes)
                          // console.log(sortable.el.childNodes[0].id)
                          let i = 0
                          const list = []
                          for (i = 0; i < sortable.el.childNodes.length; i++) {
                            list.push(`"${sortable.el.childNodes[i].id}"`)
                          }
                          // this.printDetails()
                          localStorage.setItem('Morning', list.join('|'))
                          // var order = sortable.toArray();
                          // localStorage.setItem(sortable.options.group.name, order.join('|'));
                        },
                      },
                    }}
                    tag="div"
                    style={sessionsSortableStyle}
                  >
                    {morningSessionDiv}
                  </Sortable>
                </div>
              </div>
            ) : (
              ''
            )}
            {AfternoonSession ? (
              <div className="col-lg-3 col-md-6">
                <div className="card py-3 px-2" style={{ border: '1px solid #f4f6f8' }}>
                  <h3 className="font-weight-bold text-dark font-size-18 mb-3">
                    Afternoon Session{' '}
                    <span style={{ float: 'right' }}>
                      <Button onClick={() => this.saveSessionTargets('Afternoon')} type="link">
                        Save
                      </Button>
                    </span>{' '}
                  </h3>
                  <Button
                    type="dashed"
                    style={detailsButton}
                    onClick={() => this.showDrawer('Afternoon')}
                    block
                  >
                    {' '}
                    Session details & Host
                  </Button>
                  <Sortable
                    options={{
                      group: {
                        name: 'shared',
                        put: function(to, el, node) {
                          var check = true
                          for (var key in to.el.children) {
                            if (to.el.children.hasOwnProperty(key)) {
                              if (to.el.children[key].id === node.id) {
                                check = false
                              }
                            }
                          }
                          return check
                        },
                      },
                      // onRemove: (node) => {

                      //     const newItems = this.state.afternoonSession.filter(item => item.key !== node.item.id);
                      //     this.setState({ afternoonSession: newItems })
                      // },
                      // onAdd: (node) => {
                      //     console.log(node.type)
                      //     console.log(node.item.id)
                      //     console.log(node.item.innerText)
                      //     console.log(node)
                      //     this.setState({ afternoonSession: [...this.state.afternoonSession, { key: node.item.id, text: node.item.innerText }] });
                      // },
                      store: {
                        // Get the order of elements. Called once during initialization.
                        // @param   {Sortable}  sortable
                        // @returns {Array}
                        get: function(sortable) {
                          console.log(sortable.el.childNodes)
                          let i = 0
                          const list = []
                          for (i = 0; i < sortable.el.childNodes.length; i++) {
                            list.push(`"${sortable.el.childNodes[i].id}"`)
                          }
                          localStorage.setItem('Afternoon', list.join('|'))
                        },
                        // Save the order of elements.
                        // @param {Sortable}  sortable
                        set: function(sortable) {
                          console.log(sortable.el.childNodes)
                          // console.log(sortable.el.childNodes[0].id)
                          let i = 0
                          const list = []
                          for (i = 0; i < sortable.el.childNodes.length; i++) {
                            list.push(`"${sortable.el.childNodes[i].id}"`)
                          }
                          // this.printDetails()
                          localStorage.setItem('Afternoon', list.join('|'))
                          // var order = sortable.toArray();
                          // localStorage.setItem(sortable.options.group.name, order.join('|'));
                        },
                      },
                      // onSort: function (evt, a , b,) {
                      //     var itemEl = evt.item;  // dragged HTMLElement
                      //     evt.to;    // target list
                      //     evt.from;  // previous list
                      //     evt.oldIndex;  // element's old index within old parent
                      //     evt.newIndex;  // element's new index within new parent
                      //     evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
                      //     evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
                      //     evt.clone // the clone element
                      //     evt.pullMode;
                      //     console.log(a, b, evt)
                      // },
                    }}
                    // onChange={(order, sortable, evt) => {
                    //     console.log(order, sortable, evt)
                    // }}
                    tag="div"
                    style={sessionsSortableStyle}
                  >
                    {afternoonSessionDiv}
                  </Sortable>
                </div>
              </div>
            ) : (
              ''
            )}
            {EveningSession ? (
              <div className="col-lg-3 col-md-6">
                <div className="card py-3 px-2" style={{ border: '1px solid #f4f6f8' }}>
                  <h3 className="font-weight-bold text-dark font-size-18 mb-3">
                    Evening Session{' '}
                    <span style={{ float: 'right' }}>
                      <Button onClick={() => this.saveSessionTargets('Evening')} type="link">
                        Save
                      </Button>
                    </span>{' '}
                  </h3>
                  <Button
                    type="dashed"
                    style={detailsButton}
                    onClick={() => this.showDrawer('Evening')}
                    block
                  >
                    {' '}
                    Session details & Host
                  </Button>
                  <Sortable
                    options={{
                      group: {
                        name: 'shared',
                        put: function(to, el, node) {
                          var check = true
                          for (var key in to.el.children) {
                            if (to.el.children.hasOwnProperty(key)) {
                              if (to.el.children[key].id === node.id) {
                                check = false
                              }
                            }
                          }
                          return check
                        },
                      },
                      // onRemove: (node) => {
                      //     console.log(node.type)
                      //     console.log(node.item.id)
                      //     console.log(node.item.innerText)
                      //     console.log(node)

                      //     const newItems = this.state.eveningSession.filter(item => item.key !== node.item.id);
                      //     this.setState({ eveningSession: newItems })
                      // },
                      // onAdd: (node) => {
                      //     console.log(node.type)
                      //     console.log(node.item.id)
                      //     console.log(node.item.innerText)
                      //     console.log(node)
                      //     this.setState({ eveningSession: [...this.state.eveningSession, { key: node.item.id, text: node.item.innerText }] });
                      // },
                      store: {
                        // Get the order of elements. Called once during initialization.
                        // @param   {Sortable}  sortable
                        // @returns {Array}
                        get: function(sortable) {
                          console.log(sortable.el.childNodes)
                          let i = 0
                          const list = []
                          for (i = 0; i < sortable.el.childNodes.length; i++) {
                            list.push(`"${sortable.el.childNodes[i].id}"`)
                          }
                          localStorage.setItem('Evening', list.join('|'))
                        },
                        // Save the order of elements.
                        // @param {Sortable}  sortable
                        set: function(sortable) {
                          console.log(sortable.el.childNodes)
                          // console.log(sortable.el.childNodes[0].id)
                          let i = 0
                          const list = []
                          for (i = 0; i < sortable.el.childNodes.length; i++) {
                            list.push(`"${sortable.el.childNodes[i].id}"`)
                          }
                          // this.printDetails()
                          localStorage.setItem('Evening', list.join('|'))
                          // var order = sortable.toArray();
                          // localStorage.setItem(sortable.options.group.name, order.join('|'));
                        },
                      },
                    }}
                    tag="div"
                    style={sessionsSortableStyle}
                  >
                    {eveningSessionDiv}
                  </Sortable>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
          <Drawer
            title={`${CurrentSession} Session`}
            placement="right"
            width="400px"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <SessionDetails key={CurrentSession} />
          </Drawer>
        </div>
      </Authorize>
    )
  }
}

export default ExtraAppsJiraAgileBoard
