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
            update: false
        }

    }

    render(){
        return(
            <div>
                <Search needUpdate={this.needUpdate} setDeskId={this.props.setDeskId}/>
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
            border: "1px solid black",
            borderBottom: 0,
            borderTop: 0,
            width: 550,
            margin: "10px auto"
        }
        let eachResultStyle = {
            marginBottom: 10,
            borderBottom: "1px solid black",
            borderTop: "1px solid black",
            cursor: "pointer",
            fontSize: 20,
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