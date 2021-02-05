// Основна сайта
class Site extends React.Component{
    constructor(props){
        super(props)

        // Проверка авторизации пользователя
        let username = false
        let isAuthorised = true
        $.ajax({
            url: "regAuth/isAuthorised.php",
            method: "post",
            data: {},
            success: function(result) {
                result = JSON.parse(result)
                if (result.set == true){
                    username = result.username
                    isAuthorised = true
                }
            },
            async: false
        })

        this.state = {
            // Авторизован ли пользователь
            isAuthorised: isAuthorised,
            
            // Имя пользователя
            username: username,

            // ID доски, которая просматривается
            // false - никакая доска не просматривается
            deskId: false
        }

        this.setUsername = this.setUsername.bind(this)
        this.unsetUsername = this.unsetUsername.bind(this)
        this.setDeskId = this.setDeskId.bind(this)
        this.unsetDeskId = this.unsetDeskId.bind(this)
    }

    // Установка имени пользователя
    setUsername(username){
        this.setState({
            username: username,
            isAuthorised: true
        })
    }

    // Удаление имени пользователя
    unsetUsername(){
        this.setState({
            username: false,
            isAuthorised: false
        })
    }

    // Установка ID просматриваемой доски
    setDeskId(id){
        this.setState({
            deskId: id
        })
        console.dir(id)
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
            renderData.push(<Header key="Header" username={this.state.username} />)
            if (this.state.deskId != false){
                renderData.push(<Workspace key="Workspace" deskId={this.state.deskId} exit={this.unsetDeskId} />)
            }
            else{
                renderData.push(<AllDesks key="AllDesks" setDeskId={this.setDeskId} />)
            }
        }

        // Если пользователь не авторизован
        else{
            renderData.push(<Header key="Header" username={this.state.username} />)
            renderData.push(<RegAuth key="RegAuth" setUsername={this.setUsername} unsetUsername={this.unsetUsername} />)
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
            height: 40,
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
                <div></div>
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
                <Settings />
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
                <PersonalAreaPage
                setUsername={this.props.setUsername}
                unsetUsername={this.props.unsetUsername}
            />
            </div>
        )
    }
}