import React from "react";

export const Footer = () => {
  return (
    <footer className="site-footer">

      <div className="stackContainer">
          <h6>What stacks I use</h6>
        <div className="stackBox">

          <div className="stackContainerFrontEnd">
            <div className="stackTitle">Front-End</div>
            <ul>
              <li>React</li>
              <li>react-router-dom</li>
               <li>GraphQL</li>
              <li>Apollo Client</li>              
              <li>Semantic UI</li>
            </ul>
          </div>

          <div className="stackContainerBackEnd">
            <div className="stackTitle">Back-End</div>
            <ul>
              <li>NodeJS</li>
              <li>Express</li>
              <li>Apollo Server</li>        
              <li>MongoDB</li>
            </ul>
          </div>

        </div>
      </div>
      <hr />

      <div className="container-copyright">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">
              Created by <span> zzbkahrorov@gmail.com </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
