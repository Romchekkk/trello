class PersonalAreaPage extends React.Component{
    constructor(props){
        super(props)
        
        this.state = {
            currentState: "authorisation"
        }

        this.authorisation = this.authorisation.bind(this)
        this.registration = this.registration.bind(this)
        this.setCurrentStateToAuthorisation = this.setCurrentStateToAuthorisation.bind(this)
        this.setCurrentStateToRegistration = this.setCurrentStateToRegistration.bind(this)
    }

    authorisation(){
        let form = document.querySelector("#form")
        let self = this
        $.ajax({
            url: "/regAuth/authorisation.php",
            method: "post",
            data: {
                login: form.login.value,
                password: form.password.value
            },
            success: function( result ) {
                result = JSON.parse(result)
                document.querySelector("#form [name=login]").style.boxShadow = ""
                document.querySelector("#form [name=password]").style.boxShadow = ""
                if (result.noErrors){
                    self.props.authoriseUser(result.login, result.userId)
                }
                else{
                    if (result.errorLogin){
                        document.querySelector("#form [name=login]").style.boxShadow = "0px 0px 5px red"
                    }
                    if (result.errorPassword){
                        document.querySelector("#form [name=password]").style.boxShadow = "0px 0px 5px red"
                    }
                    if (result.errorUserAssertion || result.errorUserExisting){
                        form.querySelector("[name=\"error\"]").innerHTML = "Неверное имя пользователя или пароль"
                        document.querySelector("#form [name=login]").style.boxShadow = "0px 0px 5px red"
                        document.querySelector("#form [name=password]").style.boxShadow = "0px 0px 5px red"
                    }
                }
            },
            async: false
        })
    }

    registration(){
        let form = document.querySelector("#form")
        let self = this
        $.ajax({
            url: "/regAuth/registration.php",
            method: "post",
            data: {
                login: form.login.value,
                password: form.password.value,
                passwordRepeat: form.passwordRepeat.value
            },
            success: function( result ) {
                result = JSON.parse(result)
                document.querySelector("#form [name=login]").style.boxShadow = ""
                document.querySelector("#form [name=password]").style.boxShadow = ""
                document.querySelector("#form [name=passwordRepeat]").style.boxShadow = ""
                if (result.noErrors == true){
                    self.props.authoriseUser(result.login, result.userId)
                }
                else{
                    if (result.errorLogin == true){
                        document.querySelector("#form [name=login]").style.boxShadow = "0px 0px 5px red"
                    }
                    else if (result.errorLoginLength){
                        form.querySelector("[name=\"error\"]").innerHTML = "Имя пользователя слишком длинное, максимум 20 символов"
                        document.querySelector("#form [name=login]").style.boxShadow = "0px 0px 5px red"
                    }
                    else if (result.errorUserExisting == true){
                        form.querySelector("[name=\"error\"]").innerHTML = "Пользователь с таким именем уже существует"
                        document.querySelector("#form [name=login]").style.boxShadow = "0px 0px 5px red"
                    }
                    else if (result.errorPassword == true){
                        form.querySelector("[name=\"error\"]").innerHTML = "Пароль не указан"
                        document.querySelector("#form [name=password]").style.boxShadow = "0px 0px 5px red"
                    }
                    else if (result.errorPasswordRepeat){
                        form.querySelector("[name=\"error\"]").innerHTML = "Пароль не указан повторно"
                        document.querySelector("#form [name=passwordRepeat]").style.boxShadow = "0px 0px 5px red"
                    }
                    else if (result.errorPasswordAssertion){
                        form.querySelector("[name=\"error\"]").innerHTML = "Пароли не совпадают"
                        document.querySelector("#form [name=password]").style.boxShadow = "0px 0px 5px red"
                        document.querySelector("#form [name=passwordRepeat]").style.boxShadow = "0px 0px 5px red"
                    }
                    else {
                        form.querySelector("[name=\"error\"]").innerHTML = "Непредвиденная ошибка"
                    }
                }
            },
            async: false
        })
    }

    setCurrentStateToAuthorisation(){
        this.setState({
            currentState: "authorisation"
        })
    }

    setCurrentStateToRegistration(){
        this.setState({
            currentState: "registration"
        })
    }

    render(){
        let styleRegAuth = {
            width: 350,
            position: "relative", 
            top: "50%", 
            left: "50%", 
            margin: "130px 0 0 -175px",
            textAlign: "center",
            color: "black"
        }
        let styleForm = {
            height: 210,
            backgroundColor: "gray",
            border: "1px solid black",
            borderBottom: "none",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderSpacing: 0,
            paddingTop: 10
        }
        let styleForCurrent = {
            border: "1px solid black",
            borderTop: "1px solid gray",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            cursor: "pointer",
            width: "50%",
            boxSizing: "border-box",
            backgroundColor: "gray",
            display: "inline-block",
            borderSpacing: 0,
            height: 40,
            padding: 5
        }
        let styleForSecond = {
            border: "1px solid black",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            cursor: "pointer",
            width: "50%",
            boxSizing: "border-box",
            backgroundColor: "gray",
            display: "inline-block",
            borderSpacing: 0,
            height: 40,
            padding: 5
        }
        let styleInput = {
            width: "90%",
            height: 30,
            margin: "5px 0 5px 0",
            borderRadius: 10,
            textAlign: "center"
        }
        let styles = {
            styleRegAuth: styleRegAuth,
            styleForm: styleForm,
            styleForCurrent: styleForCurrent,
            styleForSecond: styleForSecond,
            styleInput: styleInput
        }
        let content
        if (this.state.currentState == "authorisation"){
            content = <Authorisation
                action={this.authorisation}
                setCurrentStateToAuthorisation={this.setCurrentStateToAuthorisation}
                setCurrentStateToRegistration={this.setCurrentStateToRegistration}
                {...styles}
            />
        }
        if (this.state.currentState == "registration"){
            content = <Registration
                action={this.registration}
                setCurrentStateToAuthorisation={this.setCurrentStateToAuthorisation}
                setCurrentStateToRegistration={this.setCurrentStateToRegistration}
                {...styles}
            />
        }

        return(
            <div>
            {content}
            </div>
        )
    }
}

class PersonalArea extends React.Component{
    render(){
        let style={
            width: 350,
            position: "relative", 
            top: "50%", 
            left: "50%", 
            margin: "130px 0 0 -175px",
            textAlign: "center",
            color: "black",
            height: 100,
            backgroundColor: "gray",
            border: "1px solid black",
            borderRadius: 10,
            padding: "10px 0 0 0"
        }
        return(
            <div style={style}>
                <button style={this.props.styleInput} onClick={this.props.exit}>Выйти</button>
            </div>
        )
    }
}

class Authorisation extends React.Component{
    render(){
        return(
            <div style={this.props.styleRegAuth}>
                <form style={this.props.styleForm} id="form">
                    <span name="error"></span>
                    <input style={this.props.styleInput} type="text" name="login" placeholder="Имя пользователя" /><br />
                    <input style={this.props.styleInput} type="password" name="password" placeholder="Пароль" /><br />
                    <input type="button" style={this.props.styleInput} onClick={this.props.action} value="Войти" />
                </form>
                <div style={this.props.styleForSecond} onClick={this.props.setCurrentStateToRegistration}>Регистрация</div>
                <div style={this.props.styleForCurrent} onClick={this.props.setCurrentStateToAuthorisation}>Авторизация</div>
            </div>
        )
    }
}

class Registration extends React.Component{
    render(){
        return(
            <div style={this.props.styleRegAuth}>
                <form style={this.props.styleForm} id="form">
                    <span name="error"></span>
                    <input style={this.props.styleInput} type="text" name="login" placeholder="Имя пользователя" /><br />
                    <input style={this.props.styleInput} type="password" name="password" placeholder="Пароль" /><br />
                    <input style={this.props.styleInput} type="password" name="passwordRepeat" placeholder="Пароль еще раз" /><br />
                    <input type="button" style={this.props.styleInput} onClick={this.props.action} value="Зарегистрироваться"/>
                </form>
                <div style={this.props.styleForCurrent} onClick={this.props.setCurrentStateToRegistration}>Регистрация</div>
                <div style={this.props.styleForSecond} onClick={this.props.setCurrentStateToAuthorisation}>Авторизация</div>
            </div>
        )
    }
}
