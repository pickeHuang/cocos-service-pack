/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { vfmtPosUvColorTexId } from '../../../../webgl/vertex-format';
import BarFilledAssembler from '../2d/bar-filled';

export default class BarFilledAssemblerMulti extends BarFilledAssembler {
    initData() {
        let data = this._renderData;
        data.createFlexData(0, this.verticesCount, this.indicesCount, this.getVfmt());
        const indices = data.iDatas[0];
        data.initQuadIndices(indices);
    }

    getVfmt() {
        return vfmtPosUvColorTexId;
    }

    getBuffer() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }

    updateRenderData (sprite) {
        super.updateRenderData(sprite);

        if (sprite._texIdDirty) {
            sprite._updateMultiTexId(sprite.getMaterial(0), sprite._spriteFrame._texture);
            if (sprite._texIdDirty) {
                this.updateTexId(sprite);
                sprite._texIdDirty = false;
            }
        }
    }

    updateRenderDataForSwitchMaterial(sprite) {
        if (sprite._vertsDirty) {
            let fillStart = sprite._fillStart;
            let fillRange = sprite._fillRange;

            if (fillRange < 0) {
                fillStart += fillRange;
                fillRange = -fillRange;
            }

            fillRange = fillStart + fillRange;

            fillStart = fillStart > 1.0 ? 1.0 : fillStart;
            fillStart = fillStart < 0.0 ? 0.0 : fillStart;

            fillRange = fillRange > 1.0 ? 1.0 : fillRange;
            fillRange = fillRange < 0.0 ? 0.0 : fillRange;
            fillRange = fillRange - fillStart;
            fillRange = fillRange < 0 ? 0 : fillRange;

            let fillEnd = fillStart + fillRange;
            fillEnd = fillEnd > 1 ? 1 : fillEnd;

            this.updateUVs(sprite, fillStart, fillEnd);
            this.updateVerts(sprite, fillStart, fillEnd);

            sprite._vertsDirty = false;
        }

        if (sprite._texIdDirty) {
            sprite._updateMultiTexId(sprite.getMaterial(0), sprite._spriteFrame._texture);
            if (sprite._texIdDirty) {
                this.updateTexId(sprite);
                sprite._texIdDirty = false;
            }
        }
    }

}

BarFilledAssemblerMulti.prototype.floatsPerVert = 6;
BarFilledAssemblerMulti.prototype.texIdOffset = 5;
BarFilledAssemblerMulti.prototype.isMulti = true;
