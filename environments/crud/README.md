# CR API

本番にデプロイするときは `serverless.yml` の、次の plugins をコメントアウトする。

- serverless-s3-local
- serverless-offline

S3 の Bucket に以下のポリシーを手動で設定する必要がある。

```
{
 "Version": "2012-10-17",
 "Statement": [
  {
   "Effect": "Allow",
   "Principal": "*",
   "Action": [
       "s3:GetObject",
       "s3:PutObject",
       "s3:ListBucket"
   ],
   "Resource": [
       "arn:aws:s3:::tsubokawa23-star-dev-bucket",
       "arn:aws:s3:::tsubokawa23-star-dev-bucket/*"
   ]
  }
 ]
}
```
