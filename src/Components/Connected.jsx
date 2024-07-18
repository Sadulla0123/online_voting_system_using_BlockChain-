import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faClock, faVoteYea } from '@fortawesome/free-solid-svg-icons';

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="connected-header">You are Connected to Metamask <FontAwesomeIcon icon={faCheckCircle} /></h1>
            <p className="connected-account">Metamask Account: {props.account}</p>
            <p className="connected-account">Remaining Time: <FontAwesomeIcon icon={faClock} /> {props.remainingTime}</p>
            {props.showButton ? (
                <p className="connected-account"><FontAwesomeIcon icon={faExclamationCircle} /> You have already voted</p>
            ) : (
                <div>
                    <br />
                </div>
            )}
            
            <table id="myTable" className="candidates-table">
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Candidate Name</th>
                    <th>Symbol</th>
                    <th>Candidate Votes</th>
                </tr>
                </thead>
                <tbody>
                {props.candidates.map((candidate) => (
                    <tr key={candidate.index}>
                    <td>{candidate.index}</td>
                    <td>{candidate.name}</td>
                    <td><img src={candidate.imageUrl} alt={`${candidate.name} symbol`} width="30" height="30" className="candidate-image"/></td>
                    <td>{candidate.voteCount}</td>
                    <td>
                        {!props.showButton && (
                            <button 
                                className="login-button" 
                                onClick={() => props.voteFunction(candidate.index)}
                            >
                                Vote <FontAwesomeIcon icon={faVoteYea} />
                            </button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Connected;
