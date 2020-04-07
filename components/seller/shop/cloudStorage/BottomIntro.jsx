import React from 'react'

const BottomIntroduction = (props) => {
  return (
    props.from == 'detail' ? (
      <div className="introduction clearfix">
        <div className="introLabel fl">使用说明:</div>
        <div className="introContent fl">
          <p>发布/编辑商品时，请在商品基本的信息页底部“生产商品方式”设置项<span className="blueStyle">手动生产方式</span>设为勾选，推送格式为PDF+JDF，其中PDF为最终文件；买家购买该商品上传PDF格式文件，操作“确认生产”时会自动生成并推送 JDF+PDF文件到云存储空间 ;</p>
          <p>当勾选自动生产模式时将推送格式为MJD MIME，您需要另外购买处理MJD文件进行自动化生产。</p>
        </div>
      </div>
    ) : (
      <div className="cloudStorageDesc">
        <p>云存储服务，免费5GB大空间、20GB流量、1年有效期，文件同步分享和自动化生产好帮手。</p>
        <p>用于买家已确认的文件时，自动生成JDF+PDF文件并推送到您的云存储空间。</p>
      </div>
    )
  )
}

export default BottomIntroduction
