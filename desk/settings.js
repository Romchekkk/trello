// Настройки доски
class FuckGoBack extends React.Component{
    render(){
        let divStyle = {
            display: "inline-block",
            float: "right"
        }
        return(
            <div style={divStyle}>
                <input type="button" value="Назад" onClick={this.props.unsetDesk}/>
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
        let divStyle = {
            display: "inline-block"
        }
        let accessRightsChanger
        if (this.state.accessRightsChanger){
            accessRightsChanger = <AccessRightsChanger closeAccessRightsChanger={this.closeAccessRightsChanger} deskId={this.props.deskId} />
        }
        return(
            <div style={divStyle}>
                {accessRightsChanger}
                <input type="button" value="Изменить права доступа" onClick={this.openAccessRightsChanger} />
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
            groupName: groupName,
            searchUsersAccessed: "",
            searchUsersNotAccessed: "",
            searchGroupsAccessed: "",
            searchGroupsNotAccessed: "",
            update: false
        }

        this.changeType = this.changeType.bind(this)
        this.changeAccessRights = this.changeAccessRights.bind(this)
        this.searchUsersAccessed = this.searchUsersAccessed.bind(this)
        this.searchUsersNotAccessed = this.searchUsersNotAccessed.bind(this)
        this.searchGroupsAccessed = this.searchGroupsAccessed.bind(this)
        this.searchGroupsNotAccessed = this.searchGroupsNotAccessed.bind(this)
        this.swapUserDedicatedAccess = this.swapUserDedicatedAccess.bind(this)
        this.swapGroupAccess = this.swapGroupAccess.bind(this)
    }

    changeType(){
        let newValue = document.querySelector("#accessRightsChangerForm").type.value
        this.setState({
            currentType: newValue,
            searchText: ""
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

    searchUsersAccessed(){
        let text = document.querySelector("#accessRightsChangerForm").searchUsersAccessed.value
        this.setState({
            searchUsersAccessed: text
        })
    }

    searchUsersNotAccessed(){
        let text = document.querySelector("#accessRightsChangerForm").searchUsersNotAccessed.value
        this.setState({
            searchUsersNotAccessed: text
        })
    }
    
    searchGroupsAccessed(){
        let text = document.querySelector("#accessRightsChangerForm").searchGroupsAccessed.value
        this.setState({
            searchGroupsAccessed: text
        })
    }

    searchGroupsNotAccessed(){
        let text = document.querySelector("#accessRightsChangerForm").searchGroupsNotAccessed.value
        this.setState({
            searchGroupsNotAccessed: text
        })
    }

    swapUserDedicatedAccess(userId){
        $.ajax({
            url: "/desk/swapUserDedicatedAccess.php",
            method: "post",
            data: {
                deskId: this.props.deskId,
                userId: userId
            },
            success: function(result) {},
            async: false
        })
        let update = !this.state.update
        this.setState({
            update: update
        })
    }

    swapGroupAccess(groupId){
        $.ajax({
            url: "/desk/swapGroupAccess.php",
            method: "post",
            data: {
                deskId: this.props.deskId,
                groupId: groupId
            },
            success: function(result) {},
            async: false
        })
        let update = !this.state.update
        this.setState({
            update: update
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
        let eachUserStyle = {
            marginBottom: 10,
            fontSize: 20,
            border: "1px solid black",
            cursor: "pointer"
        }
        let userAccessedList = {
            border: "1px solid black",
            backgroundColor: "white",
            width: 300,
            margin: "10px auto 0 auto",
            height: 200,
            overflowY: "scroll"
        }
        let searchStyle={
            textAlign: "center",
            marginBottom: 10
        }
        
        let access
        let searchResult = []
        if (this.state.currentType == 1){
            let userAccessed = []
            let self = this
            $.ajax({
                url: "/desk/searchUsersAccessed.php",
                method: "post",
                data: {
                    deskId: this.props.deskId,
                    text: this.state.searchUsersAccessed
                },
                success: function(result) {
                    result = JSON.parse(result)
                    if (result.length != 0){
                        for (let value in result){
                            userAccessed.push(
                            <div key={result[value].id} style={eachUserStyle} onClick={()=>self.swapUserDedicatedAccess(result[value].id)}>
                                {result[value].login}
                            </div>
                            )
                        }
                    }
                },
                async: false
            })
            let userNotAccessed = []
            $.ajax({
                url: "/desk/searchUsersNotAccessed.php",
                method: "post",
                data: {
                    deskId: this.props.deskId,
                    text: this.state.searchUsersNotAccessed
                },
                success: function(result) {
                    result = JSON.parse(result)
                    if (result.length != 0){
                        for (let value in result){
                            userNotAccessed.push(
                            <div key={result[value].id} style={eachUserStyle} onClick={()=>self.swapUserDedicatedAccess(result[value].id)}>
                                {result[value].login}
                            </div>
                            )
                        }
                    }
                },
                async: false
            })
            access = <div>
                <div style={userAccessedList}>
                    <input type="text" style={searchStyle} name="searchUsersAccessed" placeholder="Поиск..." onChange={this.searchUsersAccessed}/>
                    {userAccessed}<div style={hiddenStyle}><input type="text" name="group"/></div>
                </div>
                <div style={userAccessedList}>
                    <input type="text" style={searchStyle} name="searchUsersNotAccessed" placeholder="Поиск..." onChange={this.searchUsersNotAccessed}/>
                    {userNotAccessed}<div style={hiddenStyle}></div>
                </div>
            </div>
        }
        else if (this.state.currentType == 2){
            let groupAccessed = []
            let self = this
            $.ajax({
                url: "/desk/searchGroupsAccessed.php",
                method: "post",
                data: {
                    deskId: this.props.deskId,
                    text: this.state.searchGroupsAccessed
                },
                success: function(result) {
                    result = JSON.parse(result)
                    if (result.length != 0){
                        for (let value in result){
                            groupAccessed.push(
                            <div key={result[value].id} style={eachUserStyle} onClick={()=>self.swapGroupAccess(result[value].id)}>
                                {result[value].group_name}
                            </div>
                            )
                        }
                    }
                },
                async: false
            })
            let groupNotAccessed = []
            $.ajax({
                url: "/desk/searchGroupsNotAccessed.php",
                method: "post",
                data: {
                    deskId: this.props.deskId,
                    text: this.state.searchGroupsNotAccessed
                },
                success: function(result) {
                    result = JSON.parse(result)
                    if (result.length != 0){
                        for (let value in result){
                            groupNotAccessed.push(
                            <div key={result[value].id} style={eachUserStyle} onClick={()=>self.swapGroupAccess(result[value].id)}>
                                {result[value].group_name}
                            </div>
                            )
                        }
                    }
                },
                async: false
            })
            access = <div>
                <div style={userAccessedList}>
                    <input type="text" style={searchStyle} name="searchGroupsAccessed" placeholder="Поиск..." onChange={this.searchGroupsAccessed}/>
                    {groupAccessed}<div style={hiddenStyle}><input type="text" name="group"/></div>
                </div>
                <div style={userAccessedList}>
                    <input type="text" style={searchStyle} name="searchGroupsNotAccessed" placeholder="Поиск..." onChange={this.searchGroupsNotAccessed}/>
                    {groupNotAccessed}<div style={hiddenStyle}></div>
                </div>
            </div>
        }
        else{
            access = <div style={hiddenStyle}>Группа: <input type="text" name="group" defaultValue={this.state.groupName} /></div>
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
                {access}
                {searchResult}
                <input type="button" style={styleInputAccessRightsChanger} value="Изменить режим доступа" onClick={this.changeAccessRights} />
            </form>
        </div>
        )
    }
}