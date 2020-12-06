class Chat extends React.Component{
    render(){
        let chatStyle={
            margin: "0 10px 10px 10px",
            width: "30%",
            boxSizing: "border-box",
            border: "1px solid black",
            float: "right",
            height: screen.availHeight*0.8
        }
        return(
            <div id="chat" style={chatStyle}>
                Чат
            </div>
        )
    }
}