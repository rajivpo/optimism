import { expect } from '../../setup'

/* Imports: External */
import hre from 'hardhat'
import { ethers, Contract, Signer } from 'ethers'

/* Imports: Internal */
import { ChugSplashActionBundle, getChugSplashActionBundle } from '../../../src'
import { NON_NULL_BYTES32, NON_ZERO_ADDRESS } from '../../helpers'

describe('L2ChugSplashDeployer', () => {
  let signer1: Signer
  let signer2: Signer
  before(async () => {
    ;[signer1, signer2] = await hre.ethers.getSigners()
  })

  // tslint:disable-next-line
  let L2ChugSplashDeployer: Contract

  describe('owner', () => {
    it('should have an owner', async () => {
      expect(await L2ChugSplashDeployer.owner()).to.equal(
        await signer1.getAddress()
      )
    })
  })

  describe('setOwner', () => {
    it('should allow the current owner to change ownership', async () => {
      await expect(
        L2ChugSplashDeployer.connect(signer1).setOwner(
          await signer2.getAddress()
        )
      ).to.not.be.reverted

      expect(await L2ChugSplashDeployer.owner()).to.equal(
        await signer2.getAddress()
      )
    })

    it('should revert if caller is not the owner', async () => {
      await expect(
        L2ChugSplashDeployer.connect(signer2).setOwner(
          await signer2.getAddress()
        )
      ).to.be.revertedWith('ChugSplashDeployer: sender is not owner')
    })
  })

  describe('approveTransactionBundle', () => {
    it('should revert if caller is not the owner', async () => {
      await expect(
        L2ChugSplashDeployer.connect(signer2).approveTransactionBundle(
          ethers.constants.HashZero,
          0
        )
      ).to.be.revertedWith('ChugSplashDeployer: sender is not owner')
    })

    it('should allow the owner to approve a new transaction bundle', async () => {
      await expect(
        L2ChugSplashDeployer.connect(signer1).approveTransactionBundle(
          NON_NULL_BYTES32,
          1234
        )
      ).to.not.be.reverted

      expect(await L2ChugSplashDeployer.currentBundleHash()).to.equal(
        NON_NULL_BYTES32
      )

      expect(await L2ChugSplashDeployer.currentBundleSize()).to.equal(1234)
    })

    it('should revert if trying to approve a bundle when another bundle is already active', async () => {
      await L2ChugSplashDeployer.connect(signer1).approveTransactionBundle(
        NON_NULL_BYTES32,
        1234
      )

      await expect(
        L2ChugSplashDeployer.connect(signer1).approveTransactionBundle(
          NON_NULL_BYTES32,
          1234
        )
      ).to.be.revertedWith(
        'ChugSplashDeployer: previous bundle has not yet been fully executed'
      )
    })
  })

  describe('executeAction', () => {
    const dummyAction = {
      actionType: 0,
      target: NON_ZERO_ADDRESS,
      data: '0x1234',
    }

    const dummyActionProof = {
      actionIndex: 0,
      siblings: [],
    }

    it('should revert if there is no active upgrade bundle', async () => {
      await expect(
        L2ChugSplashDeployer.executeAction(dummyAction, dummyActionProof)
      ).to.be.revertedWith('ChugSplashDeployer: there is no active bundle')
    })

    describe('while there is an active upgrade bundle', () => {
      const bundle: ChugSplashActionBundle = getChugSplashActionBundle([
        {
          target: NON_ZERO_ADDRESS,
          code: '0x1234',
        },
        {
          target: NON_ZERO_ADDRESS,
          key: `0x${'11'.repeat(32)}`,
          value: `0x${'22'.repeat(32)}`,
        },
      ])

      beforeEach(async () => {
        await L2ChugSplashDeployer.connect(signer1).approveTransactionBundle(
          bundle.root,
          bundle.actions.length
        )
      })

      it('should revert if the given action proof is invalid (1: bad action index)', async () => {
        await expect(
          L2ChugSplashDeployer.executeAction(bundle.actions[0].action, {
            ...bundle.actions[0].proof,
            actionIndex: 1, // Bad action index
          })
        ).to.be.revertedWith('ChugSplashDeployer: invalid action proof')
      })

      it('should revert if the given action proof is invalid (2: bad siblings)', async () => {
        await expect(
          L2ChugSplashDeployer.executeAction(bundle.actions[0].action, {
            ...bundle.actions[0].proof,
            siblings: [ethers.constants.HashZero], // Bad siblings
          })
        ).to.be.revertedWith('ChugSplashDeployer: invalid action proof')
      })

      it('should revert if the given action proof is invalid (2: bad action)', async () => {
        await expect(
          L2ChugSplashDeployer.executeAction(
            bundle.actions[0].action,
            bundle.actions[1].proof // Good proof but for the wrong action
          )
        ).to.be.revertedWith('ChugSplashDeployer: invalid action proof')
      })

      it('should be able to trigger a SETCODE action', async () => {
        await expect(
          L2ChugSplashDeployer.executeAction(
            bundle.actions[0].action,
            bundle.actions[0].proof
          )
        ).to.not.be.reverted

        // TODO: CHECK
      })

      it('should be able to trigger a SETSTORAGE action', async () => {
        await expect(
          L2ChugSplashDeployer.executeAction(
            bundle.actions[1].action,
            bundle.actions[1].proof
          )
        ).to.not.be.reverted

        // TODO: CHECK
      })

      it('should revert if trying to execute the same action more than once', async () => {
        await L2ChugSplashDeployer.executeAction(
          bundle.actions[0].action,
          bundle.actions[0].proof
        )

        await expect(
          L2ChugSplashDeployer.executeAction(
            bundle.actions[0].action,
            bundle.actions[0].proof
          )
        ).to.be.revertedWith(
          'ChugSplashDeployer: action has already been executed'
        )
      })

      it('should change the upgrade status when the bundle is complete', async () => {
        expect(await L2ChugSplashDeployer.hasActiveBundle()).to.equal(true)

        for (const action of bundle.actions) {
          await L2ChugSplashDeployer.executeAction(action.action, action.proof)
        }

        expect(await L2ChugSplashDeployer.hasActiveBundle()).to.equal(false)
      })

      it('should allow the upgrader to submit a new bundle when the previous bundle is complete', async () => {
        for (const action of bundle.actions) {
          await L2ChugSplashDeployer.executeAction(action.action, action.proof)
        }

        await expect(
          L2ChugSplashDeployer.connect(signer1).approveTransactionBundle(
            bundle.root,
            bundle.actions.length
          )
        ).to.not.be.reverted
      })
    })
  })

  describe('cancelTransactionBundle', () => {
    it('should revert if caller is not the owner', async () => {
      await expect(
        L2ChugSplashDeployer.connect(signer2).cancelTransactionBundle()
      ).to.be.revertedWith('ChugSplashDeployer: sender is not owner')
    })

    it('should revert if there is no active bundle', async () => {
      await expect(
        L2ChugSplashDeployer.connect(signer1).cancelTransactionBundle()
      ).to.be.revertedWith(
        'ChugSplashDeployer: cannot cancel when there is no active bundle'
      )
    })

    describe('when a bundle has been created', () => {
      const bundle: ChugSplashActionBundle = getChugSplashActionBundle([
        {
          target: NON_ZERO_ADDRESS,
          code: '0x1234',
        },
        {
          target: NON_ZERO_ADDRESS,
          code: '0x4321',
        },
        {
          target: NON_ZERO_ADDRESS,
          code: '0x5678',
        },
      ])

      beforeEach(async () => {
        await L2ChugSplashDeployer.approveTransactionBundle(
          bundle.root,
          bundle.actions.length
        )
      })

      it('should allow the owner to cancel an active bundle immediately after creating it', async () => {
        await expect(
          L2ChugSplashDeployer.connect(signer1).cancelTransactionBundle()
        ).to.not.be.reverted

        expect(await L2ChugSplashDeployer.currentBundleHash()).to.equal(
          ethers.constants.HashZero
        )

        expect(await L2ChugSplashDeployer.currentBundleSize()).to.equal(0)
      })

      it('should allow the owner to cancel an active bundle immediately after creating it', async () => {
        await L2ChugSplashDeployer.executeAction(
          bundle.actions[0].action,
          bundle.actions[0].proof
        )

        await L2ChugSplashDeployer.executeAction(
          bundle.actions[1].action,
          bundle.actions[1].proof
        )

        await expect(
          L2ChugSplashDeployer.connect(signer1).cancelTransactionBundle()
        ).to.not.be.reverted

        expect(await L2ChugSplashDeployer.currentBundleHash()).to.equal(
          ethers.constants.HashZero
        )

        expect(await L2ChugSplashDeployer.currentBundleSize()).to.equal(0)
      })
    })
  })
})
