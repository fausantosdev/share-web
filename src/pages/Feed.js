import React, { Component } from 'react'

import './Feed.css'

import more from '../assets/more.svg'
import like from '../assets/like.svg'
import comment from '../assets/comment.svg'
import send from '../assets/send.svg'

import api from '../services/api'

import { io } from 'socket.io-client'

class Feed extends Component {

    state = {
        feed: []
    }

    async componentDidMount() {// Esse método é executado automaticamente quando o componente é montado em tela.

        this.registerToSocket()

        const response = await api.get('posts')

        this.setState({ feed: response.data })
    }

    registerToSocket = () => {
        
        const socket = io(process.env.REACT_APP_API_URL)

        
        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ...this.state.feed] })
        })

        socket.on('like', likedPost => {
            this.setState({
                feed: this.state.feed.map(post =>
                    post._id === likedPost._id ? likedPost : post
                )
            })
        })
    }

    handleLike = id => {
        api.post(`posts/${id}/like`)
    }

    render() {
        return (
            <section id="post-list">
                {this.state.feed.map(post => (
                    <article key={post._id}>
                        <header>
                            <div className="user-info">
                                <span>{post.author}</span>
                                <span className="place">{post.place}</span>
                            </div>

                            <img src={more} alt="Mais" />
                        </header>

                        <img src={post.thumbnail_url} alt="" />

                        <footer>
                            <div className="actions">
                                <button onClick={() => this.handleLike(post._id)/* A arrow function n executa a função, ela passa a função como referencia, use sempre com funções que precisem de parametros */}>
                                    <img src={like} alt="" />
                                </button>
                                <img src={comment} alt="" />
                                <img src={send} alt="" />
                            </div>

                            <strong>{post.likes}</strong>

                            <p>
                                {post.description}
                                <span>{post.hashtags}</span>
                            </p>
                        </footer>
                    </article>
                ))}
            </section>
        )
    }
}

export default Feed