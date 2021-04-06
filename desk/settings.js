// Настройки доски
//¯\_(ツ)_/¯
class FuckGoBack extends React.Component{
    render(){
        let buttonStyle = {
            margin: "20px 0 0 34%"
        }
        return(
            <div>
                <input style={buttonStyle} type="button" value="Назад" onClick={this.props.unsetDesk}/>
            </div>
        )
    }
}

class Settings extends React.Component{

    constructor(props){
        super(props)

        this.state={
            accessRightsChanger: false
        }

        this.openAccessRightsChanger = this.openAccessRightsChanger.bind(this)
        this.closeAccessRightsChanger = this.closeAccessRightsChanger.bind(this)
    }

    openAccessRightsChanger(){
        if (true){
            this.setState({
                accessRightsChanger: true
            })
        }
    }

    closeAccessRightsChanger(){
        if (true){
            this.setState({
                accessRightsChanger: false
            })
        }
    }

    render(){
        let settingsStyle={
            margin: 10,
            width: "68%",
            boxSizing: "border-box",
            height: 50
        }
        let accessRightsChanger
        if (this.state.accessRightsChanger){
            accessRightsChanger = <AccessRightsChanger closeAccessRightsChanger={this.closeAccessRightsChanger} deskId={this.props.deskId} />
        }
        return(
            <div style={settingsStyle}>
                {accessRightsChanger}
                <input type="button" value="Изменить права доступа" onClick={this.openAccessRightsChanger} />
                <input type="button" value="Назад" onClick={this.props.unsetDesk}/>
            </div>
        )
    }
}

class AccessRightsChanger extends React.Component{
    constructor(props){
        super(props)

        let currentType
        let groupName
        $.ajax({
            url: "/desk/getAccessRights.php",
            method: "post",
            data: {
                desk_id: this.props.deskId
            },
            success: function(result) {
                result = JSON.parse(result)
                currentType = result.currentType
                groupName = result.groupName
            },
            async: false
        })

        this.state={
            currentType: currentType,
            groupName: groupName
        }

        this.changeType = this.changeType.bind(this)
        this.changeAccessRights = this.changeAccessRights.bind(this)
    }

    changeType(){
        let newValue = document.querySelector("#accessRightsChangerForm").type.value
        this.setState({
            currentType: newValue
        })
    }

    changeAccessRights(){
        let form = document.querySelector("#accessRightsChangerForm")
        let newType = form.type.value
        let self = this
        $.ajax({
            url: "/desk/changeAccessRights.php",
            method: "post",
            data: {
                desk_id: self.props.deskId,
                newType: newType,
                newGroup: form.group.value
            },
            success: function(result) {
                self.props.closeAccessRightsChanger()
            },
            async: false
        })
    }

    render(){
        let styleAccessRightsChanger = {
            width: "100vw",
            height: "100vh",
            position: "absolute", 
            top: 0, 
            left: 0,
            textAlign: "center",
            color: "black",
            zIndex: 10,
            backgroundColor: "rgba(78, 78, 78, 0.5)"
        }
        let styleFormAccessRightsChanger = {
            width: 350,
            padding: 30,
            position: "relative", 
            top: "50%", 
            left: "50%", 
            margin: "-250px 0 0 -175px",
            backgroundColor: "gray",
            border: "1px solid black",
            borderRadius: 10,
            borderSpacing: 0,
        }
        let styleInputAccessRightsChanger = {
            width: "90%",
            height: 30,
            margin: "5px 0 5px 0",
            borderRadius: 10,
            textAlign: "center"
        }
        let styleCloseButton = {
            width: 20,
            height: 20,
            border: "1px solid black",
            backgroundColor: "rgba(78,78,78)",
            cursor: "pointer",
            position: "absolute",
            right: 10,
            top: 10,
            padding: 1
        }
        let hiddenStyle = {
            display: "none"
        }
        
        let groupAccess
        if (this.state.currentType == 2){
            groupAccess = <div>Группа: <input type="text" name="group" placeholder="Название группы" defaultValue={this.state.groupName}/></div>
        }
        else{
            groupAccess = <div style={hiddenStyle}>Группа: <input type="text" name="group" placeholder="Название группы" defaultValue={this.state.groupName}/></div>
        }

        return(
        <div style={styleAccessRightsChanger}>
            <form style={styleFormAccessRightsChanger} id="accessRightsChangerForm">
                <div style={styleCloseButton} onClick={this.props.closeAccessRightsChanger}>✖</div>
                Режим доступа: <select name="type" defaultValue={this.state.currentType} onChange={this.changeType}>
                    <option value="0">Только владелец</option>
                    <option value="1">Выделенный</option>
                    <option value="2">Групповой</option>
                    <option value="3">Общий</option>
                </select>
                <br />
                {groupAccess}
                <input type="button" style={styleInputAccessRightsChanger} value="Изменить режим доступа" onClick={this.changeAccessRights} />
            </form>
        </div>
        )
    }
}