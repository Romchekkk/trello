// Настройки доски
class Settings extends React.Component{
    render(){
        let settingsStyle={
            margin: 10,
            width: "68%",
            boxSizing: "border-box",
            border: "1px solid black",
            height: 50
        }
        return(
            <div style={settingsStyle}>
                Настройки
            </div>
        )
    }
}