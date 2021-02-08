/*class AllDesks extends React.Component{
    constructor(props){
        super(props)

        this.state = {
        }
    }

    render(){
        return(
            <input type="button" onClick={()=>this.props.setDeskId(1)} value="Открыть первую доску"/>
        )
    }
}*/

class AllDesks extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            update: false,
            desksOwn: 2,
            desksHistory: 3,
            desksFavorite: 1,
        }

        this.openFavorite = this.openFavorite.bind(this)
        this.openHistory = this.openHistory.bind(this)
        this.openOwn = this.openOwn.bind(this)
    }

    openHistory(){
        if (this.state.desksFavorite > this.state.desksOwn){
            this.setState({
                desksOwn: 1,
                desksHistory: 3,
                desksFavorite: 2,
            })
        }
        else{
            this.setState({
                desksOwn: 2,
                desksHistory: 3,
                desksFavorite: 1,
            })
        }
    }

    openFavorite(){
        if (this.state.desksOwn > this.state.desksHistory){
            this.setState({
                desksOwn: 2,
                desksHistory: 1,
                desksFavorite: 3,
            })
        }
        else{
            this.setState({
                desksOwn: 1,
                desksHistory: 2,
                desksFavorite: 3,
            })
        }
    }

    openOwn(){
        if (this.state.desksFavorite > this.state.desksHistory){
            this.setState({
                desksOwn: 3,
                desksHistory: 1,
                desksFavorite: 2,
            })
        }
        else{
            this.setState({
                desksOwn: 3,
                desksHistory: 2,
                desksFavorite: 1,
            })
        }
    }

    render(){
        return(
            <div>
                <Search needUpdate={this.needUpdate} setDeskId={this.props.setDeskId}/>
                <DesksViewer index={this.state.desksHistory} name={"История"} change={this.openHistory} userId={this.props.userId} setDeskId={this.props.setDeskId}/>
                <DesksViewer index={this.state.desksOwn} name={"Мои доски"} change={this.openOwn} userId={this.props.userId} setDeskId={this.props.setDeskId}/>
                <DesksViewer index={this.state.desksFavorite} name={"Избранные"} change={this.openFavorite} userId={this.props.userId} setDeskId={this.props.setDeskId}/>
            </div>
        )
    }
}

class Search extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            searchText: ""
        }

        this.onSearch = this.onSearch.bind(this)
    }

    onSearch(){
        let searchText = document.querySelector("#searchText").value
        this.setState({
            searchText: searchText
        })
    }

    render(){
        let containerStyle = {
            margin: 20,
            width: 580,
            height: 50
        }
        let searchStyle = {
            height: 50,
            padding: "0 0 0 10px",
            border: "2px solid black",
            borderRight: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            width: "530px",
            fontSize: 20,
            boxSizing: "border-box",
            outline: "none",
        }
        let magnifierStyle = {
            position: "absolute",
            height: 50,
            padding: 10,
            display: "inline-block",
            width: "50px",
            border: "2px solid black",
            boxSizing: "border-box",
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderLeft: 0,
        }
        let handStyle = {
            position: "relative",
            transform: "rotate(45deg)",
            border: "1px solid black",
            width: 10,
            top: 20,
            left: 13,
        }
        let glassStyle = {
            position: "relative",
            border: "2px solid black",
            width: 14,
            height: 14,
            borderRadius: "50%",
        }
        let glareStyle = {
            position: "relative",
            borderTop: "1px solid black",
            borderRight: "1px solid black",
            borderTopRightRadius: "100%",
            width: 4,
            height: 4,
            top: -14,
            left: 9,
        }
        let searchResultStyle = {
            borderBottom: 0,
            border: "1px solid black",
            width: 550,
            margin: "10px auto",
            backgroundColor: "white",
            position: "relative",
            zIndex: 99,
            padding: 5,
        }
        let eachResultStyle = {
            marginBottom: 10,
            border: "1px solid black",
            cursor: "pointer",
            fontSize: 20,
            backgroundColor: "white",
            zIndex: 100,
            position: "relative",
        }
        let test = []
        let searchResult = []
        if (this.state.searchText != ""){
            let self = this
            $.ajax({
                url: "allDesks/search.php",
                method: "post",
                data: {
                    text: this.state.searchText
                },
                success: function( result ) {
                    result = JSON.parse(result)
                    if (result.length != 0){
                        for (let value in result){
                            searchResult.push(
                            <div key={result[value].id} style={eachResultStyle} onClick={() => self.props.setDeskId(result[value].id)}>
                                {result[value].desk_name}
                            </div>
                            )
                        }
                    }
                },
                async: false
            })
            test.push(<div key={1} style={searchResultStyle}>{searchResult}</div>)
        }
        return(
            <div style={containerStyle} >
                <input id="searchText" style={searchStyle} type="text" placeholder="Поиск..." onChange={this.onSearch} />
                <div style={magnifierStyle}>
                    <div style={handStyle}></div>
                    <div style={glassStyle}></div>
                    <div style={glareStyle}></div>
                </div>
                {test}
            </div>
        )
    }
}

class DesksViewer extends React.Component{
    constructor(props){
        super(props)

        this.state = {

        }
        
        this.openDeskAdder = this.openDeskAdder.bind(this)
        this.createDesk = this.createDesk.bind(this)
    }

    openDeskAdder(){
        document.querySelector("#deskAdderForm").style.display = "block"
        document.querySelector("#deskAdder").style.display = "none"
    }

    createDesk(){
        let form = document.querySelector("#deskAdderForm")
        if (form != null){
            let self = this
            let deskName = form.deskName.value
            $.ajax({
                url: "allDesks/createDesk.php",
                method: "post",
                data: {
                    id: self.props.userId,
                    deskName: deskName,
                },
                success: function(result) {
                    result = JSON.parse(result)
                    self.props.setDeskId(result)
                },
                async: false
            })
        }
    }

    render(){
        let miniDeskStyle={
            display: "inline-block",
            position: "relative",
            border: "1px solid black",
            margin: "20px 48px",
            width: 500,
            height: 250,
            textAlign: "center",
            backgroundColor: "white",
            cursor: "pointer",
        }
        let deskNameStyle={
            position: "absolute",
            top: "50%",
            left: "50%",
            fontSize: 30,
            transform: "translate(-50%, -50%)",
            margin: 0,
        }
        let addDeskStyle={
            position: "absolute",
            top: "50%",
            left: "50%",
            fontSize: 30,
            border: "1px solid black",
            width: 35,
            borderRadius: "50%",
            backgroundColor: "#ccc",
            transform: "translate(-50%, -50%)",
            margin: 0,
            display: "block",
        }
        let deskAdderForm={
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: 0,
            display: "none",
        }
        let leftShift = 0
        let desks = []
        if (this.props.name == "История"){
            leftShift = 10
            if (this.props.index == 3){
                desks = setDesks("history", this, this.props.userId, miniDeskStyle, deskNameStyle)
            }
        }
        else if (this.props.name == "Мои доски"){
            leftShift = 105
            if (this.props.index == 3){
                desks = setDesks("own", this, this.props.userId, miniDeskStyle, deskNameStyle)
                desks.push(<div key={0} style={miniDeskStyle} onClick={this.openDeskAdder}>
                    <p id="deskAdder" style={addDeskStyle}>+</p>
                    <form id="deskAdderForm" style={deskAdderForm}>
                        <input type="text" name="deskName" placeholder="Имя доски"/><br />
                        <input type="button" value="Создать" onClick={this.createDesk}/>
                    </form>
                </div>)
            }
        }
        else if (this.props.name == "Избранные"){
            leftShift = 200
            if (this.props.index == 3){
                desks = setDesks("favorite", this, this.props.userId, miniDeskStyle, deskNameStyle)
            }
        }
        let deskChangerStyle={
            width: 100,
            height: 30,
            textAlign: "center",
            position: "relative",
            top: 20,
            left: leftShift,
            backgroundColor: "white",
            zIndex: this.props.index+3,
            borderLeft: "1px solid transparent",
            borderRight: "1px solid transparent",
            borderImage: "linear-gradient(0deg, black, white)",
            borderImageSlice: 1,
            cursor: "pointer",
        }
        let containerStyle = {
            zIndex: this.props.index,
            position: "absolute",
            top: 110,
            left: 20,
            width: "100%",
        }
        let deskViewerStyle = {
            position: "absolute",
            top: 0,
            width: "98%",
            height: 730,
            margin: "50px auto 0 auto",
            boxShadow: "0 5px 20px 1px black",
            zIndex: this.props.index,
            backgroundColor: "white",
            overflow: "auto",
        }

        return(
            <div style={containerStyle}>
                <div style={deskChangerStyle} onClick={this.props.change}>
                    {this.props.name}
                </div>
                <div style={deskViewerStyle}>
                    {desks}
                </div>
            </div>
        )
    }
}

function setDesks(desksType, self, userId, miniDeskStyle, deskNameStyle){
    let desks = []
    $.ajax({
        url: "allDesks/getDesks.php",
        method: "post",
        data: {
            id: userId,
            type: desksType,
        },
        success: function(result) {
            result = JSON.parse(result)
            for (let value in result){
                desks.push(<div key={result[value].id} style={miniDeskStyle} onClick={() => self.props.setDeskId(result[value].id)}>
                    <p style={deskNameStyle}>{result[value].desk_name}</p>
                </div>)
            }
        },
        async: false
    })
    return desks
}