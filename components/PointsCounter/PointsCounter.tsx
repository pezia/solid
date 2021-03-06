import { inject, observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import React, { Component } from 'react'

import { Container, Big, Counter, Label, ShareContainer } from './style'
import { Share } from '~/components/Share'
import { AppModel } from '~/models/app'

interface IInjectedProps {
  app: Instance<typeof AppModel>
}

class BasePointsCounter extends Component {
  public root: HTMLElement

  public animationTimeout: number

  public updatesCount = 0

  componentDidUpdate() {
    // don't show animation on initial update when mobx injects props
    this.updatesCount++
    if (this.updatesCount < 2) return

    this.root.classList.add('is-bouncing')
    this.animationTimeout = window.setTimeout(() => this.root.classList.remove('is-bouncing'), 1000)
  }

  componentWillUnmount() {
    clearTimeout(this.animationTimeout)
  }

  get injected() {
    return this.props as IInjectedProps
  }

  render() {
    const { app } = this.injected
    return (
      <Container ref={node => (this.root = node)}>
        <Counter>
          <Label>Ваш счёт:</Label>
          <Big>{app.userScore}</Big> /{app.totalScore}
        </Counter>

        {app.userScore > 0 && (
          <ShareContainer>
            <Share />
          </ShareContainer>
        )}
      </Container>
    )
  }
}

export const PointsCounter = inject('app')(observer(BasePointsCounter))
