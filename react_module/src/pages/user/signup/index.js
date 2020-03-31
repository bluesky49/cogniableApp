import React from 'react'
import { Helmet } from 'react-helmet'
import styles from './style.module.scss'
import RegisterForm from './RegisterForm'

class Register extends React.Component {


  render() {

    return (
      <div>
        <Helmet title="Register" />

        <div className={styles.content}>

          <div className={styles.form}>
            <p className={styles.formTitle}>Please Sign Up</p>
            <RegisterForm />
          </div>
        </div>
        <footer className={styles.footer}>
          <ul className={styles.footerNav}>
            <li>
              <a href="javascript: void(0);">Terms of Use</a>
            </li>
            <li>
              <a href="javascript: void(0);">Compliance</a>
            </li>
            <li>
              <a href="javascript: void(0);">Confidential Information</a>
            </li>
            <li>
              <a href="javascript: void(0);">Support</a>
            </li>
            <li>
              <a href="javascript: void(0);">Contacts</a>
            </li>
          </ul>
        </footer>

      </div>
    )
  }
}

export default Register
