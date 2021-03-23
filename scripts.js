// Основна сайта
class Site extends React.Component{
    constructor(props){
        super(props)

        // Проверка авторизации пользователя
        let login = false
        let isAuthorised = false
        let userId = false
        $.ajax({
            url: "regAuth/isAuthorised.php",
            method: "post",
            data: {},
            success: function(result) {
                result = JSON.parse(result)
                if (result.set == true){
                    login = result.login
                    isAuthorised = true
                    userId = result.userId
                }
            },
            async: false
        })

        this.state = {
            // Авторизован ли пользователь
            isAuthorised: isAuthorised,
            
            // Имя пользователя
            login: login,

            // ID доски, которая просматривается
            deskId: false,

            // ID пользвателя
            userId: userId,
        }

        this.authoriseUser = this.authoriseUser.bind(this)
        this.unAuthoriseUser = this.unAuthoriseUser.bind(this)
        this.setDeskId = this.setDeskId.bind(this)
        this.unsetDeskId = this.unsetDeskId.bind(this)
    }

    // Установка имени пользователя
    authoriseUser(login, userId){
        this.setState({
            login: login,
            isAuthorised: true,
            userId: userId
        })
    }

    // Удаление имени пользователя
    unAuthoriseUser(){
        $.ajax({
            url: "regAuth/unAuthorise.php",
            method: "post",
            data: {},
            success: function(result) {},
            async: false
        })
        this.setState({
            login: false,
            isAuthorised: false,
            userId: false
        })
    }

    // Установка ID просматриваемой доски
    setDeskId(id){

        // Запись в историю о посещении доски
        let self = this
        $.ajax({
            url: "allDesks/addDeskToHistory.php",
            method: "post",
            data: {
                user_id: self.state.userId,
                desk_id: id,
            },
            success: function(result) {},
            async: false
        })
        this.setState({
            deskId: id
        })
    }

    // Удаление ID просматриваемой доски
    unsetDeskId(){
        this.setState({
            deskId: false
        })
    }

    render(){
        let renderData = []

        // Если пользователь авторизован
        if (this.state.isAuthorised){
            renderData.push(<Header key="Header" login={this.state.login} unAuthoriseUser={this.unAuthoriseUser} />)
            if (this.state.deskId != false){
                renderData.push(<Workspace key="Workspace" deskId={this.state.deskId} exit={this.unsetDeskId} unsetDesk={this.unsetDeskId} />)
            }
            else{
                renderData.push(<AllDesks key="AllDesks" setDeskId={this.setDeskId} userId={this.state.userId} />)
            }
        }

        // Если пользователь не авторизован
        else{
            renderData.push(<RegAuth key="RegAuth" authoriseUser={this.authoriseUser} />)
        }

        return(
            <div>
                {renderData}
            </div>
        )
    }
}

// Верхняя часть сайта
class Header extends React.Component{
    render(){
        let styleMain = {
            width: "100%",
            backgroundColor: "#7085ff",
            height: 50,
            padding: 20,
            margin: 0,
            boxSizing: "border-box"
        }
        return(
            <div style={styleMain}>
                <div></div>
                <div></div>
                <div></div>

                <div></div>

                <div></div>
                <div></div>
                <div><input type="button" onClick={this.props.unAuthoriseUser} value="Выйти"/></div>
            </div>
        )
    }
}

// Рабочее пространство пользователя (доска, её настройки и чат)
class Workspace extends React.Component{
    render(){
        return(
            <div>
                <Chat deskId={this.props.deskId}/>
                <Settings unsetDesk={this.props.unsetDesk}/>
                <Desk deskId={this.props.deskId} />
            </div>
        )
    }
}

// Меню авторизации/регистрации
class RegAuth extends React.Component{
    render(){
        return(
            <div>
                <PersonalAreaPage authoriseUser={this.props.authoriseUser} />
            </div>
        )
    }
}