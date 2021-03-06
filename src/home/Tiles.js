import React, { Component } from "react";
import { BrowserRouter, Link, Router, Route, Switch, Redirect, HashRouter } from "react-router-dom";
import { render } from 'react-dom'
import axiosInstance from "../utils/AxiosInstance";
import FontAwesome from "react-fontawesome";
import { Modal, ModalManager, Effect } from "react-dynamic-modal";
import Prize from '../prize/Listofprizes';
import { push } from 'react-router-redux';
import Home from "./Home";



//Pop Up Modal
class MyModal extends Component {
  render() {

    const { text, onRequestClose } = this.props;
    return (
      <Modal onRequestClose={onRequestClose} effect={Effect.ScaleUp}>
        <h2>Item Locked</h2>
        <p>{text}</p>
        <button onClick={ModalManager.close}>Close</button>
      </Modal>
    );
  }
}



class Tiles extends Component {
  constructor(props) {
    super(props);


    this.state = {
      tiles: undefined,
      loading: false
    };
    this.getTiles = this.getTiles.bind(this);
  }

  //Call Home Page Tiles Function
  async componentWillMount() {
    await this.getTiles();
  }

  //Function for getting data for Tiles from tiles.json
  async getTiles() {
    try {
      this.setState({ loading: true });
      let response = await axiosInstance.get("tiles.json");
      let tilesData = response.data;
      this.setState({
        loading: false,
        tiles: tilesData
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  //Pop Up Modal
  openModal(text) {
    ModalManager.open(<MyModal text={text} onRequestClose={() => true} />);
  }

  //Render to List of Prizes Page
  openPrizePage(name, prizePageLink) {

    render((
      <BrowserRouter>
      </BrowserRouter>
    ),
      document.getElementById('root'));
    window.location = `/prizes/name=${name}?prizePageLink=${prizePageLink}`;
  }


  render() {
    let body = null;
    if (this.state.loading) {
      body = <div className="row">Loading...</div>;
    } else if (this.state.tiles) {
      const tilesView = this.state.tiles.map(tile => {
        return (
          <div
            className={
              tile.type === "mythic"
                ? "card text-center bg-secondary"
                : "card text-center"
            }
            onClick={tile.type === "legendary" ? () => this.openPrizePage(tile.name, tile.type_details) : ""}>
            {tile.type === "discount" && (
              <span className="notify-badge">{tile.type_details}</span>
            )
            }

            <img
              className="card-img-top"
              src={tile.image_url}
              alt={tile.name}
            />
            <div className="card-block">
              <h4 className="card-title ">{tile.name}</h4>
              {tile.type === "mythic" && (
                <a
                  className="btn btn-primary"
                  onClick={() => this.openModal(tile.type_details)}
                >
                  <FontAwesome name="lock" /> Info
                </a>
              )}

            </div>
          </div >
        );
      });
      body = <div className="scrolling-wrapper">
        <h4> Fall Season </h4>
        {tilesView}

      </div>;
    }
    return body;
  }
}

export default Tiles;
