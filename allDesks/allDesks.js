class AllDesks extends React.Component{
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
}