import EchoReply from "./EchoReply/EchoReply"



const EchoReplies = ({echo, setShowReplies, ...replyProps}) => {
    const {replies} = echo

    const echoReplies = replies.map(reply => (
            <EchoReply key={reply._id} reply={reply} {...replyProps}/>
    ))

    return (
        <div className="replies-container">
            <div onClick={() => setShowReplies(false)}>
                hide replies
            </div>
            <div className="replies-list">
                {echoReplies}
            </div>
        </div>
    )
}

export default EchoReplies

