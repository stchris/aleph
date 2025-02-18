import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withRouter from 'app/withRouter';
import Screen from 'components/Screen/Screen';
import { endpoint } from 'app/api';
import { loginWithPassword } from 'actions/sessionActions';
import { showResponseToast } from 'app/toast';
import { PasswordAuthActivate } from 'components/auth/PasswordAuth';

export class ActivateScreen extends Component {
  constructor(props) {
    super(props);
    this.onActivate = this.onActivate.bind(this);
  }

  onActivate(data) {
    const { params, intl } = this.props;

    endpoint
      .post('/roles', { code: params.code, ...data })
      .then((res) =>
        this.props.loginWithPassword(res.data.email, data.password)
      )
      .catch((e) => {
        showResponseToast(e.response, intl);
      });
  }

  render() {
    const { params, session, intl } = this.props;

    if (!params.code || session.loggedIn) {
      return <Navigate to="/" replace />;
    }

    return (
      <Screen exemptFromRequiredAuth>
        <div className="small-screen-outer">
          <div className="small-screen-inner">
            <section className="small-screen">
              <h1>
                <FormattedMessage
                  id="signup.activate"
                  defaultMessage="Activate your account"
                />
              </h1>
              <PasswordAuthActivate
                className="bp3-card"
                onSubmit={this.onActivate}
                intl={intl}
              />
            </section>
          </div>
        </div>
      </Screen>
    );
  }
}
const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { loginWithPassword };
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  injectIntl
)(ActivateScreen);
