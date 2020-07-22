import React, { Component } from 'react'
import Authorize from 'components/LayoutComponents/Authorize'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'
import client from '../../apollo/config'

class EESAGroups extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      completed: 0,
      questions: [],
      currentQuestion: {},
      scoreboard: [],
      totalScore: 0.0,
      levels: [],
      dbQuestionNumber: 1,
      loadingQuestion: true,
      groups: [],
      selected: '',
      selectedName: '',
    }
  }

  componentDidMount() {
    let selected = ''
    const { location } = this.props
    client
      .query({
        query: gql`
        query{
          vbmappGroups(area:"${location.areaID}"){
              edges{
                  node{
                      id,
                      apiGroup,
                      groupName,
                      noQuestion,
                  }
              }
          }
        }
        `,
      })
      .then(result => {
        console.log(result.data.vbmappGroups.edges)
        selected = result.data.vbmappGroups.edges[0].node.id
        this.setState({
          groups: result.data.vbmappGroups.edges,
          selected: result.data.vbmappGroups.edges[0].node.id,
          selectedName: result.data.vbmappGroups.edges[0].node.groupName,
        })
        this.getQuestion(selected)
      })
  }

  getGroups = () => {
    let bg = '#FFF'
    let textColor = '#000'
    const { groups, selected } = this.state
    const gr = []
    for (let x = 0; x < groups.length; x += 1) {
      if (selected === groups[x].node.id) {
        bg = '#3E7BFA'
        textColor = '#FFF'
      } else {
        bg = '#FFF'
        textColor = '#000'
      }
      gr.push(
        <div
          role="button"
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
          onClick={() => this.handleGroupChange(groups[x].node.id, groups[x].node.groupName)}
          style={{
            backgroundColor: bg,
            color: textColor,
            cursor: 'pointer',
            boxShadow:
              '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 10,
            flex: 1,
            marginTop: 20,
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 0,
              textTransform: 'capitalize',
            }}
          >
            {groups[x].node.groupName}
          </p>
          <p>Questions: {groups[x].node.noQuestion}</p>
        </div>,
      )
    }
    return gr
  }

  getQuestion = selected => {
    const { location } = this.props
    const { student, areaID, masterID, test } = location
    let totalScore = 0
    client
      .mutate({
        mutation: gql`mutation{
        vbmappGetQuestions(input:{
          student:"${student}",
          area:"${areaID}", 
          group:"${selected}", 
          master:"${masterID}"
        }){
          area,
          group,
          questions
        }
      }`,
      })
      .then(result => {
        const questionss = JSON.parse(result.data.vbmappGetQuestions.questions)
        const ques = []
        // Looping through all questions
        for (let x = 0; x < questionss.length; x += 1) {
          const options = []
          // Getting previous assessments for this question
          const pa = questionss[x].previous_assess
          // Looping through all the previous assessments for a question
          for (let y = 0; y < pa.length; y += 1) {
            // If there exists an assessment for this question and this test
            if (pa[y].test === test) {
              switch (pa[y].score) {
                case '0.0':
                  options.push(
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FF8080',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #FF8080',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[0].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 0 }}>0</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[1].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>/</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[2].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>x</p>
                      </div>
                    </div>,
                  )
                  break

                case '0.5':
                  totalScore += 0.5
                  options.push(
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[0].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>0</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FF9C52',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #FF9C52',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[1].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 0 }}>/</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[2].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>x</p>
                      </div>
                    </div>,
                  )
                  break

                case '1.0':
                  totalScore += 1.0
                  options.push(
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[0].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>0</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[1].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>/</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#4BAEA0',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #4BAEA0',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[2].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 0 }}>x</p>
                      </div>
                    </div>,
                  )
                  break

                default:
                  options.push(
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[0].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>0</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[1].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>/</p>
                      </div>
                      <div
                        role="button"
                        onKeyDown={this.handleKeyDown}
                        tabIndex="0"
                        style={{
                          backgroundColor: '#FFF',
                          width: 40,
                          height: 40,
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #DDD',
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          this.handleAnswer(
                            questionss[x].responses[2].score,
                            questionss[x].questionNum,
                          )
                        }
                      >
                        <p style={{ fontSize: 18, marginBottom: 0 }}>x</p>
                      </div>
                    </div>,
                  )
                  break
              }
            }
          }
          ques.push(
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
                borderTop: '1px solid #DDD',
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 10,
              }}
            >
              <p style={{ fontSize: 18, color: '#777', flex: 1 }}>{questionss[x].text}</p>
              {options}
            </div>,
          )
        }

        this.setState({
          questions: ques,
          loadingQuestion: false,
          totalScore,
        })
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  handleGroupChange = (groupID, groupName) => {
    this.setState({
      loadingQuestion: true,
      completed: 0,
      selected: groupID,
      selectedName: groupName,
      scoreboard: [],
      currentIndex: 0,
      questions: [],
      currentQuestion: {},
      totalScore: 0.0,
      levels: [],
      dbQuestionNumber: 1,
    })
    this.getQuestion(groupID)
  }

  handleKeyDown = () => {}

  handleAnswer(score, quesNum) {
    const { selected } = this.state
    this.setState({
      loadingQuestion: true,
    })
    const { location } = this.props
    const { student, areaID, masterID, test } = location
    client
      .mutate({
        mutation: gql`
      mutation{
        vbmappSubmitResponse(input:{
            master:"${masterID}",
            area:"${areaID}",
            group:"${selected}",
            question:${quesNum},
            score:${score}
            
        }){
            total
            details{
                id
                questionNum
                score
                date
                groups{
                    id
                    groupName
                }
            }
        }
    }`,
      })
      .then(result => {
        this.getQuestion(selected)
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  render() {
    const {
      groups,
      selected,
      selectedName,
      questions,
      currentQuestion,
      completed,
      scoreboard,
      loadingQuestion,
      levels,
      totalScore,
    } = this.state
    const { currentIndex, dbQuestionNumber } = this.state
    console.log(currentQuestion)
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="col-sm-3 col-md-3">
              {groups && groups.length > 0 && this.getGroups()}
            </div>
            <div className="col-sm-6 col-md-6">
              <div
                style={{
                  boxShadow:
                    '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
                  borderRadius: 10,
                  paddingTop: 20,
                  paddingBottom: 20,
                  marginTop: 20,
                }}
              >
                <h5
                  style={{ paddingLeft: 20, paddingRight: 20, textAlign: 'right', display: 'flex' }}
                >
                  Score: {totalScore}
                </h5>
                {loadingQuestion && <p>Loading Question...</p>}
                {loadingQuestion === false && questions.length > 0 && questions}
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default EESAGroups
